import PageHeader from "@/components/page-header";
import { createClient } from "@/utils/supabase/server";

type OrdersPageProps = {};

export default async function OrdersPage({}: OrdersPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col flex-1">
      <PageHeader current="orders" />
    </div>
  );
}
