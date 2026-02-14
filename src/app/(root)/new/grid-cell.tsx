"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilEdit02Icon, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CellData } from "./new-grid-page";

interface GridCellProps {
  cellId: string;
  cellData: CellData | undefined;
  rowHeader: string;
  colHeader: string;
  isEditing: boolean;
  editingContent: string;
  onOpenChange: (open: boolean) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
}

export function GridCell({
  cellId,
  cellData,
  rowHeader,
  colHeader,
  isEditing,
  editingContent,
  onOpenChange,
  onContentChange,
  onSave,
}: GridCellProps) {
  return (
    <Popover open={isEditing} onOpenChange={onOpenChange}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <div className="flex-center cell relative cursor-pointer p-2 [&:hover_.edit-icon]:opacity-100" />
        }
      >
        <span>{cellData?.content}</span>
        <div className="flex-center bg-card/60 edit-icon pointer-events-none absolute inset-1 z-10 rounded-sm opacity-0 backdrop-blur-sm duration-100">
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            strokeWidth={2}
            className="text-muted-foreground size-4"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex flex-row flex-wrap items-center gap-1">
            <code className="font-semibold">{rowHeader}</code>
            <HugeiconsIcon
              icon={X}
              strokeWidth={2}
              className="text-muted-foreground size-3"
            />
            <code className="font-semibold">{colHeader}</code>
          </p>
          <p>
            <span className="font-semibold">ID:</span>{" "}
            {cellId.split("-").join("")}
          </p>
          <Input
            value={editingContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Enter content..."
            autoFocus
          />
          <Button
            size="sm"
            disabled={editingContent === (cellData?.content || "")}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
