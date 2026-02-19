"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export type Item = {
  id: string;
  value: string;
};

type EditListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: Item[];
  maxItems: number;
  onItemsChange: Dispatch<SetStateAction<Item[]>>;
  onSave: () => void;
};

export function EditListDialog({
  open,
  onOpenChange,
  title,
  items,
  maxItems,
  onItemsChange,
  onSave,
}: EditListDialogProps) {
  const [originalItems, setOriginalItems] = useState<Item[]>([]);

  useEffect(() => {
    if (open) {
      setOriginalItems(items);
    }
  }, [open]);

  const handleAddItem = () => {
    if (items.length < maxItems)
      onItemsChange((prev) => [
        ...prev,
        { id: `new-${Date.now()}`, value: "" },
      ]);
  };

  const handleDeleteItem = (id: string) => {
    if (items.length > 1)
      onItemsChange((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemValueChange = (id: string, value: string) => {
    onItemsChange((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md!">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="scrollbar-thin flex max-h-115 flex-col gap-y-2 overflow-y-auto p-1">
          {items.map(({ id, value }) => (
            <div key={id} className="flex items-center gap-x-2">
              <Input
                value={value}
                onChange={(e) => handleItemValueChange(id, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                disabled={items.length < 2}
                onClick={() => handleDeleteItem(id)}
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          disabled={maxItems <= items.length}
          onClick={handleAddItem}
        >
          <HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
          Add New
        </Button>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onItemsChange(originalItems)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
