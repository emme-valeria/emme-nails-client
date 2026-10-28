/**
 * Adaptadores de Google Workspace en modo fixture.
 * Mantienen los contratos existentes y almacenan las simulaciones en memoria;
 * no hacen solicitudes a Google Calendar ni Google Sheets.
 */
export interface CalendarSyncResult {
  googleEventId?: string;
  status: 'created' | 'updated' | 'deleted' | 'error';
  error?: string;
}

type DemoSpreadsheet = { title: string; tabs: Record<string, unknown[][]> };
const demoSpreadsheets = new Map<string, DemoSpreadsheet>();

export async function syncAppointmentToCalendar(
  _accessToken: string,
  appointment: any,
  _client: any,
  _service: any,
): Promise<CalendarSyncResult> {
  if (appointment.status === 'cancelled') return { status: 'deleted' };
  return {
    googleEventId: appointment.googleEventId || `demo-calendar-event-${appointment.id}`,
    status: appointment.googleEventId ? 'updated' : 'created',
  };
}

export async function createSpreadsheet(_accessToken: string, title: string): Promise<string> {
  const id = `demo-sheet-${Date.now()}`;
  demoSpreadsheets.set(id, { title, tabs: {} });
  return id;
}

export async function setupSpreadsheetTabs(_accessToken: string, spreadsheetId: string): Promise<void> {
  const spreadsheet = demoSpreadsheets.get(spreadsheetId) || { title: 'Emme Studio · Demo local', tabs: {} };
  ['Citas y Agenda', 'Listado de Clientas', 'Resumen Financiero'].forEach((name) => {
    spreadsheet.tabs[name] ||= [];
  });
  demoSpreadsheets.set(spreadsheetId, spreadsheet);
}

export async function writeSheetValues(
  _accessToken: string,
  spreadsheetId: string,
  tabName: string,
  values: unknown[][],
): Promise<void> {
  const spreadsheet = demoSpreadsheets.get(spreadsheetId) || { title: 'Emme Studio · Demo local', tabs: {} };
  spreadsheet.tabs[tabName] = values;
  demoSpreadsheets.set(spreadsheetId, spreadsheet);
}

export async function exportClientsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  clients: any[],
): Promise<void> {
  const headers = ['ID Clienta', 'Nombre', 'Teléfono', 'Email', 'VIP?', 'Alergias / Piel', 'Preferencias', 'Cumpleaños'];
  const rows = clients.map((client) => [
    client.id?.slice(0, 8) || '',
    client.name || '',
    client.phone || '',
    client.email || '',
    client.isVip ? 'SÍ' : 'NO',
    client.allergies || 'Ninguna',
    client.preferences || 'Ninguna',
    client.birthday || 'No registrado',
  ]);
  await writeSheetValues(accessToken, spreadsheetId, 'Listado de Clientas', [headers, ...rows]);
}

export async function exportAppointmentsToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  appointments: any[],
  clients: any[],
  services: any[],
): Promise<void> {
  const headers = ['ID Cita', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Clienta', 'Servicio', 'Monto', 'Estado', 'Notas'];
  const clientsById = new Map(clients.map((client) => [client.id, client.name]));
  const servicesById = new Map(services.map((service) => [service.id, service]));
  const rows = appointments.map((appointment) => {
    const service = servicesById.get(appointment.serviceId);
    return [
      appointment.id?.slice(0, 8) || '',
      appointment.date?.split('T')[0] || '',
      appointment.startTime || '',
      appointment.endTime || '',
      clientsById.get(appointment.clientId) || 'Desconocido',
      service?.name || 'Desconocido',
      service?.price ? `$${service.price}` : '$0',
      String(appointment.status || '').toUpperCase(),
      appointment.notes || '',
    ];
  });
  await writeSheetValues(accessToken, spreadsheetId, 'Citas y Agenda', [headers, ...rows]);
}

export async function exportFinancesToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  appointments: any[],
  services: any[],
): Promise<void> {
  const servicesById = new Map(services.map((service) => [service.id, service]));
  const completed = appointments.filter((appointment) => appointment.status === 'completed');
  const totalSales = completed.reduce((total, appointment) => total + (servicesById.get(appointment.serviceId)?.price || 0), 0);
  const averageTicket = completed.length ? (totalSales / completed.length).toFixed(2) : '0';
  const rows = [
    ['Métrica del Estudio', 'Valor de demostración'],
    ['Total facturado (citas completadas)', `$${totalSales}`],
    ['Citas atendidas', completed.length],
    ['Ticket promedio', `$${averageTicket}`],
    ['Citas del historial', appointments.length],
    ['Citas pendientes', appointments.filter((appointment) => appointment.status === 'pending').length],
    ['Citas confirmadas', appointments.filter((appointment) => appointment.status === 'confirmed').length],
    ['Citas canceladas', appointments.filter((appointment) => appointment.status === 'cancelled').length],
    ['Generado localmente', new Date().toLocaleString()],
  ];
  await writeSheetValues(accessToken, spreadsheetId, 'Resumen Financiero', rows);
}
