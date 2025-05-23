// Types for find-psychologist page
export interface Psychologist {
  id: number;
  name: string;
  title: string;
  association: string[];
  rating: number;
  experience: number;
  location: string;
  coordinates: [number, number];
  price: number;
  isPriceEstimated: boolean; // Indicates whether the price is real or estimated
  available: boolean;
  imageUrl: string;
  description: string;
  education?: string;
  languages: string[];
  sessionTypes: string[];
  // Additional fields from HIMPSI API
  contactNumber?: string;
  registrationId?: number;
  registrationYear?: number;
}
