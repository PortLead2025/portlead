import { z } from "zod";

export const NewInvoiceFormSchema = z.object({
  invoice_date: z.date(), // ISO string
  due_date: z.date().nullable(),
  invoice_number: z
    .string()
    .nonempty("This field is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  pay_terms: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Must be a positive number",
    })
    .nullable(),
  po_number: z.string().nullable(),
  rate_type: z.enum(["Tax", "VAT"]),
  tax_rate: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Must be a positive number",
    })
    .optional(),
  discount_rate: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Must be a positive number",
    })
    .optional(),
  currency: z.enum(["USD", "EUR", "USDT"]),
  invoice_from: z
    .string()
    .nonempty("This field is required")
    .min(2, "Min 2 characters")
    .max(25, "Max 25 characters"),
  invoice_to: z
    .string()
    .nonempty("This field is required")
    .min(2, "Min 2 characters")
    .max(25, "Max 25 characters"),
  item_name: z
    .string()
    .nonempty("This field is required")
    .min(2, "Min 2 characters")
    .max(25, "Max 25 characters"),
  quantity: z
    .string()
    .nonempty("This field is required")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num);
      },
      { message: "Quantity must be an integer" }
    ),
  price: z
    .string()
    .nonempty("This field is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  notes: z.string().max(250, "Max 250 characters").nullable(),
  terms: z.string().max(250, "Max 250 characters").nullable(),
});

export type NewInvoiceFormValues = z.infer<typeof NewInvoiceFormSchema>;
