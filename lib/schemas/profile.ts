import { z } from "zod";

export const ProfileSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(25, "Max 25 characters"),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export const UploadFileSchema = z.object({
  file: z.instanceof(File),
});
