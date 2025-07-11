import { z } from "zod";

export const FiltersFormSchema = z.object({
  date_range: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  action: z.enum(["dep", "reg", "cold"]).optional(),
  status: z.enum(["free", "sold", "check"]).optional(),
  geo: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  lang: z.array(z.string()).optional(),
  hooked_on: z.array(z.string()).optional(),
});

export type FiltersFormValues = z.infer<typeof FiltersFormSchema>;
