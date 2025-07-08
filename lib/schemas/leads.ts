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

export type NewLead = z.infer<typeof UploadLeadSchema>;
