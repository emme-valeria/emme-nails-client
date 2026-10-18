export interface BusinessProfile {
  id: string;
  name: string;
  owner: string;
  instagram?: string;
  phone?: string;
  description?: string;
  address?: string;
  logo?: string;
  workingHours?: {
    [key: string]: { open: string; close: string; active: boolean };
  };
}
