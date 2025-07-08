import UploadForm from "@/components/leads/uploadForm";
import { createClient } from "@/utils/supabase/server";

type LeadsPageProps = {};

export default async function LeadsPage({}: LeadsPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Leads</h2>
      {/* <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre> */}

      <UploadForm />
    </div>
  );
}
