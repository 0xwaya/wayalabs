export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type LeadIntake = {
  name: string;
  email: string;
  company: string;
  message: string;
  intent: string;
  source?: string;
};

export type LeadRecord = {
  id: string;
  intent: string;
  status: LeadStatus;
  created_at: string;
  contact: {
    name: string;
    email: string;
    company: string;
  } | null;
};
