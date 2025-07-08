import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceData } from "./invoice-page";
import Divider from "../divider";
import { Download, ChevronsRight } from "lucide-react";
import { useCallback } from "react";
import InvoiceResult from "./invoice-result";

type InvoiceDialogProps = {
  isOpen: boolean;
  onCloseDialog: () => void;
  invoiceData: InvoiceData | null;
  handleResetForm: () => void;
};

export function InvoiceDialog({
  isOpen,
  onCloseDialog,
  invoiceData,
  handleResetForm,
}: InvoiceDialogProps) {
  if (!invoiceData) return;

  const handleDownload = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const element = document.getElementById("invoice-content");
      if (!element) return;

      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 0.5,
        filename: `invoice-${invoiceData.invoice_number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(options).from(element).save();

      // const blob = await html2pdf().from(element).outputPdf("blob");
    },
    [invoiceData.invoice_number]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onCloseDialog}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader id="invoice-content">
          <DialogTitle>INVOICE # {invoiceData.invoice_number}</DialogTitle>
          <Divider className="my-1" />

          <InvoiceResult invoiceData={invoiceData} />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild className="w-1/2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleDownload}
            >
              <Download size={18} /> Download
            </Button>
          </DialogClose>

          <Button onClick={handleResetForm} className="w-1/2 gap-1">
            <ChevronsRight size={20} /> Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
