"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, toA1Col } from "@/lib/utils";
import { PencilEdit02Icon, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { GridSelector } from "./grid-selector";
import { GridCell } from "./grid-cell";

export type CellData = {
  label?: string;
  content?: string;
  // future properties like 'highlight', 'tags' can go here
};

export type ColumnHeadings = { [colId: string]: string }; // e.g., { 'A': 'Monday', 'B': 'Tuesday' }
export type RowHeadings = { [rowId: string]: string }; // e.g., { '1': '8:00 AM', '2': '9:00 AM' }
export type GridCells = { [cellId: string]: CellData }; // e.g., { 'A-1': { label: 'Math' } }

export type TableData = {
  id: string; // a unique ID for the whole table
  name: string;
  config: {
    rows: number;
    cols: number;
  };
  colHeadings: ColumnHeadings;
  rowHeadings: RowHeadings;
  cells: GridCells;
};

export function NewGridPage() {
  // const list = ["CYB201", "MTH203", "PHY201", "CHE201", "PHY202"];
  const [tableTheme, setTableTheme] = useState<
    "amber" | "classic" | "blue" | "excel" | "dafe"
  >("dafe");

  const [colHeadings, setColHeadings] = useState<ColumnHeadings>({});
  const [rowHeadings, setRowHeadings] = useState<RowHeadings>({});
  const [cells, setCells] = useState<GridCells>({});
  const [editingHeading, setEditingHeading] = useState<{
    type: "col" | "row";
    id: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    cellId: string;
    content: string;
  } | null>(null);

  const maxRows = 14;
  const maxCols = 12;

  const [selectedGrid, setSelectedGrid] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const handleCreateTable = (rows: number, cols: number) => {
    setSelectedGrid({ rows, cols });
  };

  return (
    <>
      <section>
        <h1 className="heading">New Table</h1>
      </section>
      <Separator />

      <section className={cn("py-2.5", selectedGrid && "")}>
        {!selectedGrid ? (
          <GridSelector
            onCreateTable={handleCreateTable}
            maxRows={maxRows}
            maxCols={maxCols}
          />
        ) : (
          <ScrollArea className="table-wrap w-full">
            <div
              className={`gridly-table s ${tableTheme}`}
              style={
                {
                  gridTemplateColumns: `minmax(80px, auto) repeat(${selectedGrid.cols}, minmax(60px, auto))`,
                  gridAutoRows: "minmax(40px, auto)",
                  "--rows": selectedGrid.rows + 1,
                  "--cols": selectedGrid.cols + 1,
                } as CSSProperties
              }
            >
              {/* Empty top-left corner */}
              <div className="flex-center cursor-pointer bg-transparent p-2 font-bold" />

              {/* Column Headers */}
              {Array.from({ length: selectedGrid.cols }).map((_, col) => {
                const colId = toA1Col(col);
                const isEditing =
                  editingHeading?.type === "col" &&
                  editingHeading?.id === colId;
                return isEditing ? (
                  <div className="relative">
                    <input
                      key={`col-header-input-${colId}`}
                      type="text"
                      value={colHeadings[colId] || ""}
                      onChange={(e) =>
                        setColHeadings((prev) => ({
                          ...prev,
                          [colId]: e.target.value,
                        }))
                      }
                      onBlur={() => setEditingHeading(null)}
                      autoFocus
                      className="border-primary absolute inset-0 rounded-none p-2 text-center"
                    />
                  </div>
                ) : (
                  <div
                    key={`col-header-${colId}`}
                    onClick={() =>
                      setEditingHeading({ type: "col", id: colId })
                    }
                    className="colHead"
                  >
                    <span>{colHeadings[colId] || colId}</span>
                    <div className="flex-center bg-card/60 edit-icon pointer-events-none absolute inset-1 z-100 rounded-sm opacity-0 backdrop-blur-sm duration-100">
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        strokeWidth={2}
                        className="text-muted-foreground size-4"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Row Headers and Data Cells */}
              {Array.from({ length: selectedGrid.rows }).flatMap((_, row) => {
                const rowId = (row + 1).toString();
                const isEditingRow =
                  editingHeading?.type === "row" &&
                  editingHeading?.id === rowId;

                return [
                  // Row Header
                  isEditingRow ? (
                    <div className="relative">
                      {" "}
                      <input
                        key={`row-header-input-${rowId}`}
                        type="text"
                        value={rowHeadings[rowId] || ""}
                        onChange={(e) =>
                          setRowHeadings((prev) => ({
                            ...prev,
                            [rowId]: e.target.value,
                          }))
                        }
                        onBlur={() => setEditingHeading(null)}
                        autoFocus
                        className="border-primary absolute inset-0 rounded-none p-2 text-center"
                      />
                    </div>
                  ) : (
                    <div
                      key={`row-header-${rowId}`}
                      onClick={() =>
                        setEditingHeading({ type: "row", id: rowId })
                      }
                      className="rowHead"
                    >
                      <span>{rowHeadings[rowId] || rowId}</span>
                      <div className="flex-center bg-card/60 edit-icon pointer-events-none absolute inset-1 z-100 rounded-sm opacity-0 backdrop-blur-sm duration-100">
                        <HugeiconsIcon
                          icon={PencilEdit02Icon}
                          strokeWidth={2}
                          className="text-muted-foreground size-4"
                        />
                      </div>
                    </div>
                  ),
                  // Data cells for this row
                  ...Array.from({ length: selectedGrid.cols }).map((_, col) => {
                    const colId = toA1Col(col);
                    const cellId = `${colId}-${rowId}`;
                    const cellData = cells[cellId];

                    const isEditingCell = editingCell?.cellId === cellId;

                    return (
                      <GridCell
                        key={`cell-${cellId}`}
                        cellId={cellId}
                        cellData={cellData}
                        rowHeader={rowHeadings[rowId] || rowId}
                        colHeader={colHeadings[colId] || colId}
                        isEditing={isEditingCell}
                        editingContent={editingCell?.content ?? ""}
                        onOpenChange={(open) => {
                          if (open) {
                            setEditingCell({
                              cellId,
                              content: cellData?.content || "",
                            });
                          } else {
                            setEditingCell(null);
                          }
                        }}
                        onContentChange={(value) => {
                          setEditingCell((prev) =>
                            prev ? { ...prev, content: value } : null,
                          );
                        }}
                        onSave={() => {
                          if (!editingCell) return;
                          setCells((prev) => ({
                            ...prev,
                            [cellId]: {
                              ...prev[cellId],
                              content: editingCell.content,
                            },
                          }));
                          setEditingCell(null); // closes popover
                        }}
                      />
                    );
                  }),
                ];
              })}
            </div>
          </ScrollArea>
        )}
      </section>
    </>
  );
}
