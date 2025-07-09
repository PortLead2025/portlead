"use server";

import {
  Lead,
  UploadLeadSchema,
  ContactLead,
  ContactLeadSchema,
} from "@/lib/schemas/leads";
import { createClient } from "@/utils/supabase/server";
import z from "zod";

export async function insertLeads(newLeads: Lead[]) {
  const validated = z.array(UploadLeadSchema).parse(newLeads);
  // обработать ошибку валидации

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const emails = validated
    .map((lead) => lead.email?.trim().toLowerCase())
    .filter(Boolean);

  const phones = validated
    .map((lead) => lead.phone_number?.toString().trim())
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

  const existingEmails = new Set(
    existing?.map((e) => e.email?.trim().toLowerCase())
  );
  const existingPhones = new Set(
    existing?.map((e) => e.phone_number?.toString().trim())
  );

  const uniqueLeads = validated.filter(
    (lead) =>
      (!lead.email || !existingEmails.has(lead.email.toLowerCase())) &&
      (!lead.phone_number || !existingPhones.has(lead.phone_number.toString()))
  );

  const duplicateLeads = validated.filter(
    (lead) =>
      (lead.email && existingEmails.has(lead.email.trim().toLowerCase())) ||
      (lead.phone_number &&
        existingPhones.has(lead.phone_number.toString().trim()))
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

export async function checkLeads(leads: ContactLead[]) {
  const validated = z.array(ContactLeadSchema).parse(leads);
  // обработать ошибку валидации

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const emails = validated
    .map((lead) => lead.email?.trim().toLowerCase())
    .filter(Boolean);

  const phones = validated
    .map((lead) => lead.phone_number?.toString().trim())
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

  const existingEmails = new Set(
    existing?.map((e) => e.email?.trim().toLowerCase())
  );
  const existingPhones = new Set(
    existing?.map((e) => e.phone_number?.toString().trim())
  );

  const uniqueLeads = validated.filter(
    (lead) =>
      (!lead.email || !existingEmails.has(lead.email.toLowerCase())) &&
      (!lead.phone_number || !existingPhones.has(lead.phone_number.toString()))
  );

  const duplicateLeads = validated.filter(
    (lead) =>
      (lead.email && existingEmails.has(lead.email.trim().toLowerCase())) ||
      (lead.phone_number &&
        existingPhones.has(lead.phone_number.toString().trim()))
  );

  return {
    success: true,
    uniques: uniqueLeads,
    duplicates: duplicateLeads,
  };
}
