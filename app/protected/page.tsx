import AddLeads from "@/components/leads/add-leads";
import CheckLeads from "@/components/leads/check-leads";
import PageHeader from "@/components/page-header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader current="dashboard" />

      <div className="mt-4 flex gap-4">
        <CheckLeads />
        <AddLeads />
      </div>
    </div>
  );
}
