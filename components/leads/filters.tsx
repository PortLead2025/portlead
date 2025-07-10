"use client";

import { cn, excelDateToJSDate } from "@/lib/utils";
import { useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "../ui/button";
import { DateRange } from "react-day-picker";
import Select from "../select";
import DatePickerWithRange from "../date-range-picker";
import { ACTIONS_LIST, STATUSES_LIST } from "./constants";

type FiltersProps = {
  className?: string;
  dropdownValues: {
    geoList: { value: string; label: string }[];
    countryList: { value: string; label: string }[];
    langList: { value: string; label: string }[];
    hookedList: { value: string; label: string }[];
  };
};

export default function Filters({
  className,
  dropdownValues: { geoList, countryList, langList, hookedList },
}: FiltersProps) {
  const [selectedGEOs, setSelectedGEOs] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [selectedHooked, setSelectedHooked] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const jsDate = excelDateToJSDate(45659);
  const timestamptz = excelDateToJSDate(45659).toISOString();

  console.log({
    dateTo: date?.to?.toISOString(),
    dateFrom: date?.from?.toISOString(),
  });

  return (
    <div className={cn(className)}>
      <div className="items-center gap-2 text-center flex flex-col md:flex-row">
        <div className="flex max-md:order-1 w-full md:w-1/2 gap-2">
          <Select
            placeholder="Action"
            options={ACTIONS_LIST}
            setSelected={setSelectedAction}
            triggerClassName="border-none w-1/2"
            contentClassName="border-none"
          />
          <Select
            placeholder="Status"
            options={STATUSES_LIST}
            setSelected={setSelectedStatus}
            triggerClassName="border-none w-1/2"
            contentClassName="border-none"
          />
        </div>

        <div className="flex w-full md:w-1/2 gap-2">
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button className="w-[120px] ml-auto">GET</Button>
        </div>
      </div>

      <div className="flex flex-col mt-2 sm:flex-row gap-2 w-full">
        <div className="w-full">
          <MultiSelect
            options={countryList}
            onValueChange={setSelectedCountries}
            placeholder="Country"
            variant="inverted"
            maxCount={1}
          />
          <MultiSelect
            className="mt-2"
            options={langList}
            onValueChange={setSelectedLangs}
            placeholder="Language"
            variant="inverted"
            maxCount={1}
          />
        </div>

        <div className="w-full">
          <MultiSelect
            options={geoList}
            onValueChange={setSelectedGEOs}
            placeholder="GEO"
            variant="inverted"
            maxCount={1}
          />
          <MultiSelect
            className="mt-2"
            options={hookedList}
            onValueChange={setSelectedHooked}
            placeholder="Hooked on"
            variant="inverted"
            maxCount={1}
          />
        </div>
      </div>
    </div>
  );
}
