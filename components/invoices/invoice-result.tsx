import Divider from "../divider";
import InvoiceItem from "./Invoice-item";
import { InvoiceData } from "./invoice-page";

type InvoiceResultProps = {
  invoiceData: InvoiceData;
};

export default function InvoiceResult({ invoiceData }: InvoiceResultProps) {
  const {
    invoice_date,
    due_date,
    invoice_from,
    invoice_to,
    item_name,
    po_number,
    pay_terms,
    quantity,
    price,
    total_data,
    notes,
    terms,
  } = invoiceData;

  const { subtotal, discountValue, taxValue, symbol, total } = total_data;

  return (
    <div className="text-[16px]">
      <InvoiceItem
        label="Invoice Date:"
        value={invoice_date.toLocaleDateString("en-US")}
      />
      <InvoiceItem
        label="Due Date:"
        value={due_date ? due_date.toLocaleDateString("en-US") : ""}
      />
      <InvoiceItem label="PO Number:" value={po_number} />
      <InvoiceItem label="Pay Terms:" value={pay_terms} />
      <InvoiceItem label="Bill From:" value={invoice_from} />
      <InvoiceItem label="Bill To:" value={invoice_to} />

      <Divider className="my-1" />

      {notes && (
        <p className="flex flex-col">
          <span className="font-medium">Notes</span>
          <span className="text-[14px] mt-1 bg-slate-100 text-gray-700 p-1 min-h-10 rounded-sm">
            {notes}
          </span>
        </p>
      )}

      {terms && (
        <p className="flex flex-col mt-2">
          <span className="font-medium">Terms</span>
          <span className="text-[14px] mt-1 bg-slate-100 text-gray-700 p-1 min-h-10 rounded-sm">
            {terms}
          </span>
        </p>
      )}

      <InvoiceItem
        className="font-semibold mt-2"
        label="ITEM:"
        value={item_name}
      />

      <Divider className="my-1" />

      <div className="flex gap-2 justify-between mt-2">
        <div className="w-1/2">
          <InvoiceItem
            className="font-semibold"
            label="QTY"
            value={Number(quantity).toFixed(2)}
          />
          <InvoiceItem
            className="font-semibold"
            label="PRICE"
            value={symbol + Number(price).toFixed(2)}
          />
          <InvoiceItem
            className="font-semibold"
            label="AMOUNT"
            value={symbol + (Number(quantity) * Number(price)).toFixed(2)}
          />
        </div>

        <div className="w-1/2">
          <InvoiceItem
            className="font-semibold"
            label="SUBTOTAL:"
            value={symbol + subtotal.toFixed(2)}
          />
          <InvoiceItem
            className="font-semibold"
            label="DISCOUNT:"
            value={symbol + discountValue.toFixed(2)}
          />
          <InvoiceItem
            className="font-semibold"
            label="TAX:"
            value={symbol + taxValue.toFixed(2)}
          />
        </div>
      </div>

      <Divider className="my-1" />

      <InvoiceItem
        className="pl-1 w-1/2 ml-auto font-semibold"
        label="Total:"
        value={symbol + total.toFixed(2)}
      />
    </div>
  );
}
