import { z } from "zod";

export const UploadLeadSchema = z.object({
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string().nullable(),
  phone_number: z.union([z.string(), z.number()]).nullable(),
  country: z.string().nullable(),
  lang: z.string().nullable(),
  geo: z.string().nullable(),
  hooked_on: z.string().nullable(),
  action: z.enum(["depositor", "registration", "cold"]).nullable(),
  date: z.number().nullable(),
  customer: z.string().nullable().optional(),
  status: z.enum(["sold", "available", "considering"]).nullable().optional(),
});

export type Lead = z.infer<typeof UploadLeadSchema>;

export const ContactLeadSchema = z.object({
  phone_number: z.union([z.string(), z.number()]).nullable().optional(),
  email: z.string().nullable().optional(),
});

export type ContactLead = z.infer<typeof ContactLeadSchema>;
