"use client";

import { DropdownValues } from "@/lib/types";
import Filters from "./filters";
import { useState } from "react";
import { Lead } from "@/lib/schemas/leads";

type LeadsPageProps = {
  dropdownValues: DropdownValues;
};

export default function LeadsPage({ dropdownValues }: LeadsPageProps) {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  return (
    <>
      <Filters
        setLeads={setLeads}
        dropdownValues={dropdownValues}
        className="mt-4"
      />

      {leads && (
        <p className="mt-4">
          <span className="text-green-400">{leads.length} </span>leads
          successfully found!
        </p>
      )}
    </>
  );
}
