import AddLeads from "@/components/leads/add-leads";
import CheckLeads from "@/components/leads/check-leads";
import PageHeader from "@/components/page-header";
import { createClient } from "@/utils/supabase/server";

type LeadsPageProps = {};

export default async function LeadsPage({}: LeadsPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader current="leads" />

      <div className="mt-4 flex gap-4">
        <CheckLeads />
        <AddLeads />
      </div>
    </div>
  );
}
