"use client";

import CreateForm from "@/components/invoices/new-invoice-form";
import PageTitle from "@/components/page-title";
import { useState } from "react";
import { NewInvoiceFormValues } from "@/lib/schemas/invoices";
import { Spinner } from "../ui/spinner";

type NewInvoicePageProps = {};

export type InvoiceData = NewInvoiceFormValues & {
  logo: File | null;
  total_data: {
    subtotal: number;
    discountPercent: number;
    discountValue: number;
    taxPercent: number;
    taxValue: number;
    total: number;
    symbol: string;
  };
};

export default function NewInvoicePage({}: NewInvoicePageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showSpinner = () => {
    setIsLoading(true);
  };

  const hideSpinner = () => {
    setIsLoading(false);
  };

  return (
    <div>
      <PageTitle>New invoice</PageTitle>
      <CreateForm showSpinner={showSpinner} hideSpinner={hideSpinner} />
      <Spinner
        className="fixed top-1/2 left-1/2 -translate-1/2"
        show={isLoading}
      />
    </div>
  );
}
