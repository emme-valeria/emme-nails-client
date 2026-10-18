import React, { useState } from 'react';
import { Sparkles, Users, Calendar, Award } from 'lucide-react';
import { STAFF_MEMBERS, StaffCard, StaffMember } from '@/features/staff';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { Dialog, DialogContent } from '@emme/ui';

export function StaffOverviewWidget() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1D1D1F]">
              Especialistas de EMME Studio
            </h3>
            <p className="text-xs text-[#86868B]">
              Selecciona a tu artista favorita para tu próximo tratamiento
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAFF_MEMBERS.map((staff) => (
          <StaffCard 
            key={staff.id} 
            staff={staff} 
            onSelect={handleBookStaff} 
          />
        ))}
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[32px] border-none shadow-2xl max-h-[90vh]">
          <AppointmentForm 
            onSuccess={() => setIsBookingModalOpen(false)}
            onCancel={() => setIsBookingModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
