import { toast } from 'sonner';

export interface CalendarSyncResult {
  googleEventId?: string;
  status: 'created' | 'updated' | 'deleted' | 'error';
  error?: string;
}

// Get the local timezone
const getLocalTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid';
};

/**
 * Creates, updates, or deletes a Google Calendar event for an appointment.
 */
export async function syncAppointmentToCalendar(
  accessToken: string,
  appointment: any,
  client: any,
  service: any
): Promise<CalendarSyncResult> {
  const timeZone = getLocalTimeZone();
  const dateStr = appointment.date.split('T')[0];
  const startISO = `${dateStr}T${appointment.startTime}:00`;
  const endISO = `${dateStr}T${appointment.endTime}:00`;

  const isCancelled = appointment.status === 'cancelled';
  const googleEventId = appointment.googleEventId;

  // Handle Deletion for Cancelled appointments if they already exist in Google Calendar
  if (isCancelled) {
    if (!googleEventId) {
      return { status: 'deleted' };
    }
    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 204 || res.status === 404) {
        return { status: 'deleted' };
      }
      const data = await res.json();
      throw new Error(data.error?.message || 'Error deleting event');
    } catch (err: any) {
      console.error('Error deleting calendar event:', err);
      return { status: 'error', error: err.message };
    }
  }

  // Build event pay load
  const eventPayload = {
    summary: `✨ Cita Nails: ${client?.name || 'Cliente'} - ${service?.name || 'Uñas'}`,
    description: `💅 **Estudio EmmeNails - Gestión de Cita**\n\n🔹 **Cliente:** ${client?.name || 'No especificado'}\n🔹 **Teléfono:** ${client?.phone || 'No especificado'}\n🔹 **Servicio:** ${service?.name || 'No especificado'}\n🔹 **Precio:** $${service?.price || '0'}\n🔹 **Duración:** ${service?.duration || '0'} min\n🔹 **Notas:** ${appointment.notes || 'Ninguna'}\n\n*Sincronizado automáticamente desde EmmeNails Studio Manager.*`,
    start: {
      dateTime: new Date(startISO).toISOString(),
      timeZone: timeZone,
    },
    end: {
      dateTime: new Date(endISO).toISOString(),
      timeZone: timeZone,
    },
    colorId: appointment.status === 'completed' ? '10' : (appointment.status === 'confirmed' ? '5' : '6'), // Green for completed, yellow/blue for rest
    status: 'confirmed',
  };

  try {
    const url = googleEventId
      ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`
      : `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

    const method = googleEventId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      // If event was previously deleted on Google Calendar but we stored the id, re-create it by calling without ID
      if (googleEventId && (res.status === 404 || res.status === 410)) {
        console.warn('Event not found on Google. Re-creating as a new event...');
        return syncAppointmentToCalendar(accessToken, { ...appointment, googleEventId: undefined }, client, service);
      }
      throw new Error(errorData.error?.message || 'Error syncing event');
    }

    const createdEvent = await res.json();
    return {
      googleEventId: createdEvent.id,
      status: googleEventId ? 'updated' : 'created',
    };
  } catch (err: any) {
    console.error('Error syncing calendar event:', err);
    return { status: 'error', error: err.message };
  }
}

/**
 * Creates a beautiful spreadsheet on Google Sheets or retrieves current and writes general business data.
 */
export async function createSpreadsheet(accessToken: string, title: string): Promise<string> {
  try {
    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: title,
        },
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || 'Error creating sheet');
    }

    const data = await res.json();
    return data.spreadsheetId;
  } catch (err: any) {
    console.error('Error creating spreadsheet:', err);
    throw err;
  }
}

/**
 * Prepares sheets (tabs) in spreadsheet if they don't exist.
 */
export async function setupSpreadsheetTabs(accessToken: string, spreadsheetId: string): Promise<void> {
  try {
    // Check sheets that exist in the spreadsheet
    const metadataRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!metadataRes.ok) throw new Error('Error retrieving spreadsheet status');
    const metadata = await metadataRes.json();
    const sheets = metadata.sheets || [];
    const sheetTitles = sheets.map((s: any) => s.properties.title);

    const neededTabs = ['Citas y Agenda', 'Listado de Clientas', 'Resumen Financiero'];
    const requests: any[] = [];

    neededTabs.forEach((tab) => {
      if (!sheetTitles.includes(tab)) {
        requests.push({
          addSheet: {
            properties: {
              title: tab,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
          },
        });
      }
    });

    if (requests.length > 0) {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });
      if (!res.ok) {
        console.warn('Warn: Could not create some sheets. Maybe already exist.');
      }
    }
  } catch (err) {
    console.error('Error ensuring sheets tabs exist:', err);
  }
}

/**
 * Writes raw structured rows to Google Sheets range.
 */
export async function writeSheetValues(
  accessToken: string,
  spreadsheetId: string,
  tabName: string,
  values: any[][]
): Promise<void> {
  try {
    // 1. Clear current cells
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A:Z:clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 2. Put new cells
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `${tabName}!A1`,
          majorDimension: 'ROWS',
          values: values,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || 'Error updating sheets values');
    }
  } catch (err: any) {
    console.error(`Error updating sheet ${tabName}:`, err);
    throw err;
  }
}

/**
 * Quick export of clients to Google Sheets.
 */
export async function exportClientsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  clients: any[]
): Promise<void> {
  const headers = [
    'ID Clienta',
    'Nombre',
    'Teléfono',
    'Email',
    'VIP?',
    'Alergias / Piel',
    'Preferencias',
    'Cumpleaños',
  ];

  const rows = clients.map((c) => [
    c.id.slice(0, 8),
    c.name || '',
    c.phone || '',
    c.email || '',
    c.isVip ? 'SÍ' : 'NO',
    c.allergies || 'Ninguna',
    c.preferences || 'Ninguna',
    c.birthday || 'No registrado',
  ]);

  const allValues = [headers, ...rows];
  await writeSheetValues(accessToken, spreadsheetId, 'Listado de Clientas', allValues);
}

/**
 * Quick export of appointments list.
 */
export async function exportAppointmentsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  appointments: any[],
  clients: any[],
  services: any[]
): Promise<void> {
  const headers = [
    'ID Cita',
    'Fecha',
    'Hora Inicio',
    'Hora Fin',
    'Clienta',
    'Servicio',
    'Monto',
    'Estado',
    'Notas',
  ];

  const clientMap = new Map(clients.map(c => [c.id, c.name]));
  const serviceMap = new Map(services.map(s => [s.id, s]));

  const rows = appointments.map((a) => {
    const s = serviceMap.get(a.serviceId);
    return [
      a.id.slice(0, 8),
      a.date.split('T')[0],
      a.startTime,
      a.endTime,
      clientMap.get(a.clientId) || 'Desconocido',
      s?.name || 'Desconocido',
      s?.price ? `$${s.price}` : '$0',
      a.status.toUpperCase(),
      a.notes || '',
    ];
  });

  const allValues = [headers, ...rows];
  await writeSheetValues(accessToken, spreadsheetId, 'Citas y Agenda', allValues);
}

/**
 * Export and sync beautiful complete dashboard KPIs to Google Sheets.
 */
export async function exportFinancesToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  appointments: any[],
  services: any[]
): Promise<void> {
  const serviceMap = new Map(services.map(s => [s.id, s]));

  // Calculate metrics
  const completedApts = appointments.filter(a => a.status === 'completed');
  const totalSales = completedApts.reduce((sum, a) => sum + (serviceMap.get(a.serviceId)?.price || 0), 0);
  const averageTicket = completedApts.length > 0 ? (totalSales / completedApts.length).toFixed(2) : '0';
  
  const headers = ['Métrica del Estudio', 'Valor Sincronizado'];
  const values = [
    headers,
    ['Total Facturado (Citas Completadas)', `$${totalSales}`],
    ['Total de Citas Atendidas', completedApts.length],
    ['Ticket Promedio por Cita', `$${averageTicket}`],
    ['Total Citas de Agenda (Histórico)', appointments.length],
    ['Citas Pendientes', appointments.filter(a => a.status === 'pending').length],
    ['Citas Confirmadas en Espera', appointments.filter(a => a.status === 'confirmed').length],
    ['Citas Canceladas', appointments.filter(a => a.status === 'cancelled').length],
    ['Última Sincronización', new Date().toLocaleString()],
  ];

  await writeSheetValues(accessToken, spreadsheetId, 'Resumen Financiero', values);
}
