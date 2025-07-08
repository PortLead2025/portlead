export type ProfileData = {
  avatar_url: string;
  created_at: string;
  full_name: string;
  id: string;
};

export type LeadAction = "depositor" | "registration" | "cold";
export type LeadStatus = "sold" | "available" | "considering";
