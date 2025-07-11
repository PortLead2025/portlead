import { z } from "zod";

export const UploadLeadSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone_number: z.union([z.string(), z.number()]).nullable().optional(),
  country: z.string().nullable().optional(),
  lang: z.string().nullable().optional(),
  geo: z.string().nullable().optional(),
  hooked_on: z.string().nullable().optional(),
  action: z.enum(["dep", "reg", "cold"]).nullable().optional(),
  date: z.number().nullable().optional(),
  customer: z.string().nullable().optional(),
  status: z.enum(["sold", "free", "check"]).nullable().optional(),
  client_name: z.string().nullable().optional(),
});

export type Lead = z.infer<typeof UploadLeadSchema>;

export const ContactLeadSchema = z.object({
  phone_number: z.union([z.string(), z.number()]).nullable().optional(),
  email: z.string().nullable().optional(),
});

export type ContactLead = z.infer<typeof ContactLeadSchema>;
