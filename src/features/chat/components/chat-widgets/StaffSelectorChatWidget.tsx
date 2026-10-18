import React from 'react';
import { STAFF_MEMBERS, StaffMember } from '@/features/staff';
import { Star, Check, ChevronRight, User } from 'lucide-react';
import { Badge } from '@emme/ui/badge';
import { cn } from '@emme/ui/lib/utils';

interface StaffSelectorChatWidgetProps {
  onSelectStaff: (staff: StaffMember) => void;
  selectedStaffId?: string;
}

export function StaffSelectorChatWidget({ onSelectStaff, selectedStaffId }: StaffSelectorChatWidgetProps) {
  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left w-full max-w-md my-1.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/[0.05] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <User className="size-4 text-purple-600 shrink-0" />
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1D1D1F]">Especialistas de Studio</h4>
            <p className="text-[10.5px] text-[#86868B]">Selecciona quién atenderá tu cita</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9.5px] font-bold text-purple-700 border-purple-200 bg-purple-50">
          Equipo Master
        </Badge>
      </div>

      {/* Flush Containerless Staff List */}
      <div className="divide-y divide-black/[0.05] max-h-[280px] overflow-y-auto custom-scrollbar">
        {STAFF_MEMBERS.map(staff => {
          const isSelected = selectedStaffId === staff.id;
          return (
            <div
              key={staff.id}
              onClick={() => onSelectStaff(staff)}
              className={cn(
                "px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group",
                isSelected ? "bg-primary/5" : "hover:bg-[#F8F8FA] active:bg-[#F2F2F5]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="size-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-black/[0.06]">
                    {staff.name.charAt(0)}
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-primary text-white flex items-center justify-center">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-[#1D1D1F] truncate group-hover:text-primary transition-colors">
                      {staff.name}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5 shrink-0">
                      <Star className="size-2.5 fill-current" />
                      {staff.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#86868B] font-medium truncate">
                    {staff.role}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {staff.extraFee ? (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    +${staff.extraFee} Fee
                  </span>
                ) : null}
                <div className={cn(
                  "size-6 rounded-full flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary text-white" : "text-[#86868B] group-hover:text-primary"
                )}>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
