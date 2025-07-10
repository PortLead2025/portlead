import { LucideDownload } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type DownloadButtonProps = ComponentPropsWithoutRef<"button"> & {};

export default function DownloadButton({
  onClick,
  className,
  ...props
}: DownloadButtonProps) {
  return (
    <button
      className={twMerge(
        "text-[14px] flex items-center gap-1 hover:text-blue-400",
        className
      )}
      type="button"
      onClick={onClick}
      {...props}
    >
      <LucideDownload size={16} /> Download
    </button>
  );
}
