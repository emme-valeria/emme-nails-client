export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  avatar: string;
  rating: number;
  completedAppointments: number;
  bio: string;
  availableDays: string[];
  isAvailableToday: boolean;
  extraFee?: number;
}
