"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Lead } from "@/lib/schemas/leads";
import { insertLeads } from "./actions";
import ActionBox from "../action-box";

type AddLeadsProps = {
  className?: string;
};

export type Row = Record<string, string | number>;

export type UploadRequest = {
  sheetName: string;
  rows: Lead[];
}[];

export default function AddLeads({ className }: AddLeadsProps) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [newLeads, setNewLeads] = useState<Lead[] | null>(null);
  const [inserting, setInserting] = useState(false);
  const [duplicates, setDuplicates] = useState<Lead[] | null>(null);

  const handleResult = (data: Lead[] | null) => {
    setNewLeads(data);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setXlsxFile(file);
    setDuplicates(null);
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
    if (!newLeads) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setInserting(true);
      setDuplicates(null);
      const {
        error: insertError,
        success,
        inserted,
        duplicates: duplicatesRes,
      } = await insertLeads(newLeads);

      if (insertError) {
        console.error("Inserting failed:", insertError);
        toast.error("Inserting failed");
        return;
      }

      if (!!duplicatesRes?.length) {
        setDuplicates(duplicatesRes);
      }

      inserted === 0
        ? toast.warning("No new leads to insert")
        : success && toast.success("Leads successfully inserted!");

      setXlsxFile(null);
      setNewLeads(null);
    } catch (e) {
      console.log("Trouble inserting file", e);
    } finally {
      setInserting(false);
    }
  };

  useEffect(() => {
    if (xlsxFile) {
      handleConvertToJson();
    }
  }, [xlsxFile]);

  return (
    <ActionBox className={cn("w-1/2", className)} title="Add leads">
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
            disabled={converting || inserting}
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
          disabled={!newLeads || converting || inserting}
          className={cn("w-full")}
          onClick={handleInsertLeads}
        >
          {inserting ? "Processing..." : "Send"}
        </Button>
      </div>

      {!!duplicates?.length && (
        <div>
          <h3 className="text-[18px] underline">
            {duplicates.length} Duplicates:
          </h3>

          <ul className="max-h-[200px] overflow-auto mt-2 pr-4">
            {duplicates?.map(({ first_name, email, phone_number }) => {
              return (
                <li
                  key={String(first_name) + Math.random()}
                  className="flex justify-between"
                >
                  <span>{email || "--"}</span>{" "}
                  <span>{phone_number || "--"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </ActionBox>
  );
}
