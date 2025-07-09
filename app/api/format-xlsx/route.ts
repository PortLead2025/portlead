import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const {
      data,
      sheetName = "Sheet1",
      fileName = "data.xlsx",
    } = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty data" },
        { status: 400 }
      );
    }

    const cleanData = data.map((row) => {
      const cleaned: Record<string, string> = {};

      for (const [key, value] of Object.entries(row)) {
        cleaned[key] =
          value === null || value === undefined ? "" : String(value);
      }
      return cleaned;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate Excel file",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
