"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/helpers";
import { Button } from "../ui/button";
import { ContactLead } from "@/lib/schemas/leads";
import { checkLeads } from "./actions";
import ActionBox from "../action-box";

type CheckLeadsProps = {};

export type Row = Record<string, string | number>;

export type UploadRequest = {
  sheetName: string;
  rows: ContactLead[];
}[];

export default function CheckLeads({}: CheckLeadsProps) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [leads, setLeads] = useState<ContactLead[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [duplicates, setDuplicates] = useState<ContactLead[] | null>(null);
  const [uniques, setUniques] = useState<ContactLead[] | null>(null);

  const handleResult = (data: ContactLead[] | null) => {
    setLeads(data);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setXlsxFile(file);
    setDuplicates(null);
    setUniques(null);
  };

  const handleInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleConvertToJson = async () => {
    if (!xlsxFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setConverting(true);

      const formData = new FormData();
      if (xlsxFile !== null) formData.set("file", xlsxFile);

      const uploadRequest = await fetch("/api/parse-xlsx", {
        method: "POST",
        body: formData,
      });

      if (!uploadRequest.ok) {
        const error = await uploadRequest.json();
        toast.error("Something went wrong while converting the file");
        console.error(error);
        return;
      }
      const response = (await uploadRequest.json()) as UploadRequest;
      handleResult(response?.map((item) => item.rows).flat() || null);
    } catch (e) {
      console.log("Trouble converting file", e);
    } finally {
      setConverting(false);
    }
  };

  const handleInsertLeads = async () => {
    if (!leads) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setChecking(true);
      setDuplicates(null);
      const {
        error,
        success,
        uniques: uniquesRes,
        duplicates: duplicatesRes,
      } = await checkLeads(leads);

      if (error) {
        console.error("Inserting failed:", error);
        toast.error("Inserting failed");
        return;
      }

      if (!!duplicatesRes?.length) {
        setDuplicates(duplicatesRes);
      }

      if (!!uniquesRes?.length) {
        setUniques(uniquesRes);
      }

      success && toast.success(`${leads.length} leads successfully checked!`);

      setXlsxFile(null);
      setLeads(null);
    } catch (e) {
      console.log("Trouble leads checking", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (xlsxFile) {
      handleConvertToJson();
    }
  }, [xlsxFile]);

  return (
    <ActionBox title="Check leads">
      <div className="flex gap-2">
        <form className="flex w-full flex-col">
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
          />

          <Button
            disabled={converting || checking}
            type="button"
            className={cn(
              xlsxFile && "bg-green-300 text-black  hover:bg-green-300"
            )}
            onClick={handleInputClick}
          >
            {xlsxFile ? xlsxFile.name : "Upload xlsx"}
          </Button>
        </form>

        <Button
          disabled={!leads || converting || checking}
          className={cn("w-full")}
          onClick={handleInsertLeads}
        >
          {checking ? "Processing..." : "Check"}
        </Button>
      </div>

      {!!uniques?.length && (
        <div>
          <h3 className="text-[18px] underline">
            <span className="text-green-500">{uniques.length}</span> Uniques:
          </h3>

          <ul className="max-h-[200px] overflow-auto mt-2 pr-4">
            {uniques?.map(({ email, phone_number }) => {
              return (
                <li
                  key={email ?? phone_number}
                  className="flex justify-between"
                >
                  <span>{email ?? phone_number}</span>{" "}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!!duplicates?.length && (
        <div>
          <h3 className="text-[18px] underline">
            <span className="text-red-400">{duplicates.length}</span>{" "}
            Duplicates:
          </h3>

          <ul className="max-h-[200px] overflow-auto mt-2 pr-4">
            {duplicates?.map(({ email, phone_number }) => {
              return (
                <li
                  key={email ?? phone_number}
                  className="flex justify-between"
                >
                  <span>{email ?? phone_number}</span>{" "}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </ActionBox>
  );
}
