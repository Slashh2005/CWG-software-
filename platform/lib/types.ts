/** Shapes mirroring platform/supabase/schema.sql. */

export type VerificationStatus = "unverified" | "under_review" | "verified" | "suspended";
export type BookingStatus = "pending" | "approved" | "declined" | "cancelled";
export type LoadStatus = "open" | "closed";
export type DocumentStatus = "missing" | "pending" | "verified" | "rejected";
export type UserRole = "transporter" | "admin";

export const DOC_TYPES = [
  { key: "git_insurance",     label: "GIT insurance certificate", hint: "Goods-in-transit cover — minimum depends on cargo value" },
  { key: "operating_licence", label: "Operating licence / operator card", hint: "Per NLTA operating licence requirements" },
  { key: "tax_clearance",     label: "Tax clearance (SARS pin)", hint: "Verified against SARS eFiling" },
  { key: "roadworthy",        label: "Roadworthy certificates (fleet)", hint: "Current certificates for all trucks offered" },
] as const;

export type DocType = (typeof DOC_TYPES)[number]["key"];

export interface Transporter {
  id: string;
  company: string;
  reg_no: string | null;
  contact_person: string;
  phone: string;
  email: string;
  base_location: string;
  fleet_size: number;
  git_cover: number | null;
  truck_types: string[];
  verification: VerificationStatus;
  admin_note: string | null;
  created_at: string;
}

export interface Load {
  id: string;
  ref: string;
  from_town: string;
  from_province: string;
  to_town: string;
  to_province: string;
  commodity: string;
  tonnage: number;
  loading_date: string;
  km: number;
  rate_per_ton: number;
  trucks_total: number;
  notes: string | null;
  status: LoadStatus;
  created_at: string;
}

/** A load joined with its computed remaining capacity. */
export interface LoadWithAvailability extends Load {
  trucks_taken: number;
  trucks_remaining: number;
}

export interface Booking {
  id: string;
  ref: string;
  load_id: string;
  transporter_id: string;
  trucks: number;
  note: string | null;
  status: BookingStatus;
  created_at: string;
  decided_at: string | null;
}

export interface ComplianceDocument {
  id: string;
  transporter_id: string;
  doc_type: DocType;
  storage_path: string | null;
  status: DocumentStatus;
  expires_at: string | null;
  uploaded_at: string | null;
}
