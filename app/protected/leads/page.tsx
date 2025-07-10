import Filters from "@/components/leads/filters";
import PageHeader from "@/components/page-header";
import { createClient } from "@/utils/supabase/server";

type LeadsPageProps = {};

export default async function LeadsPage({}: LeadsPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("leads")
    .select("geo, country, lang, hooked_on")
    .not("geo", "is", null)
    .not("country", "is", null)
    .not("lang", "is", null);

  if (error) {
    console.error("Failed to fetch fields:", error);
  }

  const geoList = Array.from(
    new Set(data?.map((item) => item.geo as string))
  ).map((geo) => ({
    value: geo,
    label: geo,
  }));
  const countryList = Array.from(
    new Set(data?.map((item) => item.country as string))
  ).map((country) => ({ value: country, label: country }));

  const langList = Array.from(
    new Set(data?.map((item) => item.lang as string))
  ).map((lang) => ({ value: lang, label: lang }));

  const hookedList = Array.from(
    new Set(data?.map((item) => item.hooked_on as string))
  ).map((hooked_on) => ({ value: hooked_on, label: hooked_on }));

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader current="leads" />
      <Filters
        dropdownValues={{ geoList, countryList, langList, hookedList }}
        className="mt-4"
      />
    </div>
  );
}
