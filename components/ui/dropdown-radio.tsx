"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/helpers";
import { ChevronDownIcon } from "lucide-react";

type DropdownRadioProps<T extends string> = {
  className?: string;
  position: T;
  setPosition: React.Dispatch<React.SetStateAction<T>>;
  options: T[];
};

export function DropdownRadio<T extends string>({
  className,
  position,
  setPosition,
  options,
}: DropdownRadioProps<T>) {
  // const [position, setPosition] = React.useState("First option");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("px-3 justify-between", className)}
        >
          {position}
          <ChevronDownIcon size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-auto min-w-max">
        {/* <DropdownMenuLabel>Panel Position</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(v) => setPosition(v as T)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
