"use server";

import { NewLead, UploadLeadSchema } from "@/lib/schemas/leads";
import { createClient } from "@/utils/supabase/server";
import z from "zod";

export async function insertLeads(newLeads: NewLead[]) {
  const validated = z.array(UploadLeadSchema).parse(newLeads); // if !valid throw err

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const emails = validated
    .map((lead) => lead.email?.toLowerCase())
    .filter(Boolean);

  const phones = validated
    .map((lead) => lead.phone_number?.toString())
    .filter(Boolean);

  const { data: existing, error: fetchError } = await supabase
    .from("leads")
    .select("email, phone_number")
    .or(
      `${emails.length ? `email.in.(${emails.map((e) => `"${e}"`).join(",")})` : ""}${
        emails.length && phones.length ? "," : ""
      }${phones.length ? `phone_number.in.(${phones.join(",")})` : ""}`
    );

  if (fetchError) return { error: "Failed to fetch existing leads" };

  const existingEmails = new Set(existing?.map((e) => e.email?.toLowerCase()));
  const existingPhones = new Set(
    existing?.map((e) => e.phone_number?.toString())
  );

  const uniqueLeads = validated.filter(
    (lead) =>
      (!lead.email || !existingEmails.has(lead.email.toLowerCase())) &&
      (!lead.phone_number || !existingPhones.has(lead.phone_number.toString()))
  );

  const duplicateLeads = validated.filter(
    (lead) =>
      (lead.email && existingEmails.has(lead.email)) ||
      (lead.phone_number && existingPhones.has(lead.phone_number))
  );

  if (uniqueLeads.length < 1) {
    return {
      success: true,
      inserted: uniqueLeads.length,
      duplicates: duplicateLeads,
    };
  }

  try {
    const { error: insertError } = await supabase
      .from("leads")
      .insert(uniqueLeads);

    if (insertError) {
      console.log({ insertError });
      return { error: "Inserting leads failed", details: insertError.message };
    }
  } catch (err) {
    const message = "Insert failed due to duplicate data";
    console.log(message, (err as Error).message);
    return {
      error: message,
      details: (err as Error).message,
    };
  }

  return {
    success: true,
    inserted: uniqueLeads.length,
    duplicates: duplicateLeads,
  };
}
