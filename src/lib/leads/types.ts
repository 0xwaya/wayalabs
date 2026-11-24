export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type SourcedCandidateStatus =
  | "new"
  | "reviewed"
  | "discarded"
  | "converted";

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

/** Outbound candidate from public data. No email required; never auto-contacted. */
export type SourcedCandidateIntake = {
  source: string;
  externalId: string;
  companyName: string;
  city?: string;
  state?: string;
  industry?: string;
  signalSummary: string;
  sourceUrl?: string;
  approvedAt?: string | null;
};

export type SourcedCandidateRecord = {
  id: string;
  source: string;
  company_name: string;
  city: string;
  state: string;
  industry: string;
  signal_summary: string;
  source_url: string;
  status: SourcedCandidateStatus;
  created_at: string;
};
