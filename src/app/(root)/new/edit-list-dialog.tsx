"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Delete02Icon,
  Add01Icon,
  DragDropIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createSwapy } from "swapy";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalItems, setOriginalItems] = useState<Item[]>([]);

  useEffect(() => {
    if (open) {
      setOriginalItems(items);
    }
  }, [open]);

  useEffect(() => {
    if (open && containerRef.current) {
      const swapy = createSwapy(containerRef.current, {});

      return () => {
        swapy.destroy();
      };
    }
  }, [open, items]);

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
        <section className="scrollbar-thin h-max max-h-115 overflow-x-clip overflow-y-auto py-1">
          <div
            ref={containerRef}
            className="swapy-container relative flex flex-col gap-y-2"
          >
            {items.map(({ id, value }) => (
              <div
                key={id}
                data-swapy-slot={`slot-${id}`}
                className="relative h-8"
              >
                <div
                  key={id}
                  data-swapy-item={`slot-${id}`}
                  className="flex h-full items-center gap-x-2"
                >
                  <div
                    data-swapy-handle
                    className="flex-center focus-visible:ring-primary/40 h-full cursor-grab touch-none rounded-md focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <HugeiconsIcon
                      icon={DragDropIcon}
                      className="text-muted-foreground size-5"
                    />
                  </div>
                  <Input
                    value={value}
                    onChange={(e) => handleItemValueChange(id, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={items.length < 2 ? true : false}
                    onClick={() => handleDeleteItem(id)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              disabled={items.length >= maxItems}
              onClick={handleAddItem}
            >
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2}
                className="size-5!"
              />
              Add New
            </Button>
          </div>
        </section>
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
