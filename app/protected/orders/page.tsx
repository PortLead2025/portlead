// Отображаются активные заказы
// Таблица с заказами (инфо)

// Функции:
// 1 Завершить все заказы

import { createClient } from "@/utils/supabase/server";

type OrdersPageProps = {};

export default async function OrdersPage({}: OrdersPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Orders</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
