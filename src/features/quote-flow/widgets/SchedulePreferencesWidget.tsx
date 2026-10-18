import React from 'react';
import { useQuoteFlow } from '../model/quote-flow.context';
import { Input } from '@emme/ui/input';
import { SegmentedCapsuleTabs, TabItem } from '@/shared/components/SegmentedCapsuleTabs';

type TimeRangeId = 'morning' | 'afternoon' | 'evening';

const TIME_RANGES: TabItem<TimeRangeId>[] = [
  { id: 'morning', label: 'Mañana (9-13h)' },
  { id: 'afternoon', label: 'Tarde (13-18h)' },
  { id: 'evening', label: 'Noche (18-20h)' },
];

export function SchedulePreferencesWidget() {
  const { state, dispatch } = useQuoteFlow();
  const { schedulePref } = state;

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-[#1D1D1F]">5. Preferencia de Horarios</h3>
        <p className="text-[11px] text-[#86868B]">
          Indica tu disponibilidad tentativa. La especialista confirmará el turno tras cotizar el diseño.
        </p>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Fecha Estimada:</label>
        <Input
          type="date"
          value={schedulePref.preferredDate || '2026-08-20'}
          onChange={(e) => dispatch({ type: 'UPDATE_SCHEDULE_PREF', payload: { preferredDate: e.target.value } })}
          className="h-9 bg-white border border-black/10 rounded-xl text-xs font-medium"
        />
      </div>

      {/* Time Range Segmented Selector */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Franja Horaria:</label>
        <SegmentedCapsuleTabs<TimeRangeId>
          items={TIME_RANGES}
          value={(schedulePref.preferredTimeRange as TimeRangeId) || 'afternoon'}
          onChange={(val) => dispatch({ type: 'UPDATE_SCHEDULE_PREF', payload: { preferredTimeRange: val } })}
          fullWidth
          size="sm"
          layoutId="schedule-time-range"
        />
      </div>

      {/* Flexibility Toggle */}
      <label className="flex items-center justify-between p-2.5 rounded-xl border border-black/[0.06] bg-[#FBFBFD] cursor-pointer text-xs">
        <div>
          <span className="font-semibold text-[#1D1D1F] block">Flexibilidad de Horario</span>
          <span className="text-[10px] text-[#86868B]">Acepto propuesta de horarios cercanos si no hay turno exacto</span>
        </div>
        <input
          type="checkbox"
          checked={schedulePref.isFlexible}
          onChange={(e) => dispatch({ type: 'UPDATE_SCHEDULE_PREF', payload: { isFlexible: e.target.checked } })}
          className="rounded border-gray-300 text-primary focus:ring-primary size-4"
        />
      </label>
    </div>
  );
}
