"use client";

import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "../ui/button";
import Select from "../select";
import DatePickerWithRange from "../date-range-picker";
import { ACTIONS_LIST, STATUSES_LIST } from "./constants";
import { Controller, useForm } from "react-hook-form";
import { FiltersFormSchema, FiltersFormValues } from "@/lib/schemas/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownValues } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { Lead } from "@/lib/schemas/leads";

type FiltersProps = {
  className?: string;
  dropdownValues: DropdownValues;
  setLeads: (leads: Lead[] | null) => void;
};

const defaultValues: FiltersFormValues = {
  action: undefined,
  status: undefined,
  geo: undefined,
  country: undefined,
  lang: undefined,
  hooked_on: undefined,
  date_range: undefined,
};

export default function Filters({
  className,
  dropdownValues: { geoList, countryList, langList, hookedList },
  setLeads,
}: FiltersProps) {
  const supabase = createClient();

  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(FiltersFormSchema),
    defaultValues,
  });

  const onSubmit = async (formValues: FiltersFormValues) => {
    setLeads(null);

    const { action, status, geo, country, lang, hooked_on, date_range } =
      formValues;

    try {
      let query = supabase.from("leads").select("*");

      if (action) {
        query = query.eq("action", action);
      }
      if (status) {
        query = query.eq("status", status);
      }
      if (geo && geo.length > 0) {
        query = query.in("geo", geo);
      }
      if (country && country.length > 0) {
        query = query.in("country", country);
      }
      if (lang && lang.length > 0) {
        query = query.in("lang", lang);
      }
      if (hooked_on && hooked_on.length > 0) {
        query = query.in("hooked_on", hooked_on);
      }
      if (date_range?.from) {
        query = query.gte("date", date_range.from.toISOString());
      }
      if (date_range?.to) {
        query = query.lte("date", date_range.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.log("error", error.message);
        toast.error("Something went wrong");
      }

      if (!!data?.length) {
        setLeads(data as Lead[]);
        toast.success(`${data?.length} leads successfully found!`);
      } else {
        toast.warning("No leads! =(");
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
      <div className="items-center gap-2 text-center flex flex-col md:flex-row">
        <div className="flex max-md:order-1 w-full md:w-1/2 gap-2">
          <Controller
            control={form.control}
            name="action"
            render={({ field }) => (
              <Select
                placeholder="Action"
                options={ACTIONS_LIST}
                value={field.value}
                setSelected={(action) => field.onChange(action)}
                triggerClassName="border-none w-1/2"
                contentClassName="border-none"
              />
            )}
          />
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                placeholder="Status"
                options={STATUSES_LIST}
                value={field.value}
                setSelected={(status) => field.onChange(status)}
                triggerClassName="border-none w-1/2"
                contentClassName="border-none"
              />
            )}
          />
        </div>

        <div className="flex w-full md:w-1/2 gap-2">
          <Controller
            control={form.control}
            name="date_range"
            render={({ field }) => (
              <DatePickerWithRange
                date={field.value}
                setDate={(dateRange) => field.onChange(dateRange)}
              />
            )}
          />
          {/* <Button onClick={resetForm} variant="outline" className="border-none">
            <RefreshCcw size={20} />
          </Button> */}
          <Button type="submit" className="w-[120px]">
            GET
          </Button>
        </div>
      </div>

      <div className="flex flex-col mt-2 sm:flex-row gap-2 w-full">
        <div className="w-full">
          <Controller
            control={form.control}
            name="country"
            render={({ field }) => (
              <MultiSelect
                value={field.value}
                options={countryList}
                onValueChange={(countries) => field.onChange(countries)}
                placeholder="Country"
                variant="inverted"
                maxCount={1}
              />
            )}
          />
          <Controller
            control={form.control}
            name="lang"
            render={({ field }) => (
              <MultiSelect
                className="mt-2"
                options={langList}
                onValueChange={(langs) => field.onChange(langs)}
                placeholder="Language"
                variant="inverted"
                maxCount={1}
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={form.control}
            name="geo"
            render={({ field }) => (
              <MultiSelect
                options={geoList}
                onValueChange={(geos) => field.onChange(geos)}
                placeholder="GEO"
                variant="inverted"
                maxCount={1}
              />
            )}
          />

          <Controller
            control={form.control}
            name="hooked_on"
            render={({ field }) => (
              <MultiSelect
                className="mt-2"
                options={hookedList}
                onValueChange={(hooked) => field.onChange(hooked)}
                placeholder="Hooked on"
                variant="inverted"
                maxCount={1}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}
