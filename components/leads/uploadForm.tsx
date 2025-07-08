"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/helpers";
import { Button } from "../ui/button";
import { NewLead } from "@/lib/schemas/leads";
import { insertLeads } from "./actions";

type UploadFormProps = {};

export type Row = Record<string, string | number>;

export type UploadRequest = {
  sheetName: string;
  rows: NewLead[];
}[];

export default function UploadForm({}: UploadFormProps) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLeads, setNewLeads] = useState<NewLead[] | null>(null);
  const [isSuccessConverting, setIsSuccessConverting] = useState(false);
  const [inserting, setInserting] = useState(false);

  const handleResult = (data: NewLead[] | null) => {
    setNewLeads(data);
  };

  console.log({ newLeads });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // setError(null);
    if (!file) return;
    setXlsxFile(file);
  };

  const handleInputClick = () => {
    fileInputRef?.current?.click();
  };

  const handleConvertToJson = async () => {
    if (!xlsxFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setIsSuccessConverting(false);

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
      setIsSuccessConverting(true);
      handleResult(response?.map((item) => item.rows).flat() || null);
    } catch (e) {
      console.log("Trouble uploading file", e);
    } finally {
      setUploading(false);
    }
  };

  const handleInsertLeads = async () => {
    if (!newLeads) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setInserting(true);
      const {
        error: insertError,
        success,
        inserted,
        duplicates,
        details,
      } = await insertLeads(newLeads);

      if (insertError) {
        console.error("Inserting failed:", insertError);
        toast.error("Inserting failed");
        return;
      }
      console.log({ inserted, duplicates, details });
      inserted === 0
        ? toast.warning("No new leads to insert")
        : success && toast.success("Leads successfully inserted!");
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
    <div className="flex items-center justify-center gap-4">
      <p>Загрузить:</p>

      <form className="flex flex-col">
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />

        <div className="flex gap-2 items-center justify-center">
          <Button
            disabled={uploading}
            type="button"
            className={cn(
              isSuccessConverting &&
                "bg-green-300 text-black  hover:bg-green-300"
            )}
            onClick={handleInputClick}
          >
            {xlsxFile ? xlsxFile.name : "Upload xlsx file"}
          </Button>
        </div>
      </form>

      <Button
        disabled={!newLeads || uploading}
        className={cn("")}
        onClick={handleInsertLeads}
      >
        {/* {uploading ? "Processing..." : "Convert to json"} */}
        Upload to DB
      </Button>
    </div>
  );
}
