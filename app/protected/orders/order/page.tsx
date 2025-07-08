// Отображается инфо заказа, тип (почты, номера, полный)

// Редактировать заказ:
// 1. Загрузить и отфильтровать уникальные почты/номера:
// - из заказа убираются не уникальные лиды и их статус становится "доступен".
// 2. Изменить кол-во:
// выбрать галочкой с начала списка или с конца

// Закрыть заказ:
// открывается модалка где можно выгрузить и в таблице лидов отметить лиды как проданные

import { createClient } from "@/utils/supabase/server";

type OrderPageProps = {};

export default async function OrderPage({}: OrderPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Order</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
