export type ProfileData = {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
};

export type LeadAction = "dep" | "reg" | "cold";
export type LeadStatus = "free" | "check" | "sold";

export type DropdownValues = {
  geoList: { value: string; label: string }[];
  countryList: { value: string; label: string }[];
  langList: { value: string; label: string }[];
  hookedList: { value: string; label: string }[];
};
