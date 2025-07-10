export type ProfileData = {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
};

export type LeadAction = "depositor" | "registration" | "cold";
export type LeadStatus = "available" | "considering" | "sold";
