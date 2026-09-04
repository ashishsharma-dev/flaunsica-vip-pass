export interface GuestDetails {
  name: string;
  phone: string;
  email: string;
  isBride: string;
  purpose: string[];
  attendingWith: string[];
  interests: string[];
}

export const PURPOSE_OPTIONS = [
  "Wedding Shopping",
  "Trousseau",
  "Casual Shopping",
  "Workwear",
] as const;

export const COMPANY_OPTIONS = ["Just me", "Friends", "Family"] as const;

export const INTEREST_OPTIONS = ["Jewellery", "Clothing", "Accessories"] as const;
