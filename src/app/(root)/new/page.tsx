"use client";

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
import { useState } from "react";

export type CellData = {
  label?: string;
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

export default function New() {
  // const list = ["CYB201", "MTH203", "PHY201", "CHE201", "PHY202"];

  const xs = useIsMobile(400);

  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [isSelectionLocked, setSelectionLocked] = useState(false);

  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);

  const [colHeadings, setColHeadings] = useState<ColumnHeadings>({});
  const [rowHeadings, setRowHeadings] = useState<RowHeadings>({});
  const [cells, setCells] = useState<GridCells>({});
  const [editingHeading, setEditingHeading] = useState<{
    type: "col" | "row";
    id: string;
  } | null>(null);

  const maxRows = 14;
  const maxCols = 12;

  const [selectedGrid, setSelectedGrid] = useState<{
    rows: number;
    cols: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    // If we are currently locked, clicking any cell will unlock.
    if (isSelectionLocked) {
      setSelectionLocked(false);
      // After unlocking, immediately treat this as a new hover
      handleHover(row, col);
    } else {
      // If we are not locked, clicking locks the selection.
      // First, make sure the state is correct for the clicked cell.
      setHoverCell({ row, col });
      setRows(row + 1);
      setCols(col + 1);
      // Then lock.
      setSelectionLocked(true);
    }
  };

  const handleHover = (row: number, col: number) => {
    if (isSelectionLocked) return;
    setHoverCell({ row, col });
    setRows(row + 1);
    setCols(col + 1);
  };

  return (
    <>
      <section>
        <h1 className="heading">New Table</h1>
      </section>
      <Separator />

      <section className="py-2.5">
        {!selectedGrid ? (
          <div className="xs:flex-row xs:gap-3 flex h-max flex-col gap-2">
            <div className="not-xs:flex-1 xs:h-max xs:border-r xs:min-w-41 xs:flex-col xs:px-1 flex w-full min-w-30 flex-row gap-2">
              {xs ? (
                <Popover>
                  <PopoverTrigger
                    render={<Button className="xs:hidden! inline-block" />}
                  >
                    Create Table
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex max-w-80 flex-col gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="rows-input" className="text-sm">
                          Rows
                        </label>
                        <Input
                          id="rows-input"
                          className="w-full text-sm"
                          type="text"
                          inputMode="numeric"
                          min={1}
                          max={maxRows}
                          value={rows}
                          onChange={(e) => {
                            setRows(Number(e.target.value));
                            setSelectionLocked(false);
                            setHoverCell(null);
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="cols-input" className="text-sm">
                          Columns
                        </label>
                        <Input
                          id="cols-input"
                          className="text-sm"
                          type="text"
                          inputMode="numeric"
                          min={1}
                          max={maxCols}
                          value={cols}
                          onChange={(e) => {
                            setCols(Number(e.target.value));
                            setSelectionLocked(false);
                            setHoverCell(null);
                          }}
                        />
                      </div>
                      <Button onClick={() => setSelectedGrid({ rows, cols })}>
                        Create Table
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex max-w-80 flex-col gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="rows-input" className="text-sm">
                      Rows
                    </label>
                    <Input
                      id="rows-input"
                      className="w-full text-sm"
                      type="text"
                      inputMode="numeric"
                      min={1}
                      max={maxRows}
                      value={rows}
                      onChange={(e) => {
                        setRows(Number(e.target.value));
                        setSelectionLocked(false);
                        setHoverCell(null);
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="cols-input" className="text-sm">
                      Columns
                    </label>
                    <Input
                      id="cols-input"
                      className="text-sm"
                      type="text"
                      inputMode="numeric"
                      min={1}
                      max={maxCols}
                      value={cols}
                      onChange={(e) => {
                        setCols(Number(e.target.value));
                        setSelectionLocked(false);
                        setHoverCell(null);
                      }}
                    />
                  </div>
                  <Button onClick={() => setSelectedGrid({ rows, cols })}>
                    Create Table
                  </Button>
                </div>
              )}
            </div>

            <div
              className={cn(
                "grid! max-w-fit shrink-0 gap-1",
                `xs:grid-cols-[repeat(12,16px)] grid-cols-[repeat(12,20px)]`,
              )}
              onMouseLeave={() => {
                if (!isSelectionLocked) {
                  setHoverCell(null);
                  // setCols(1);
                  //        setRows(1);
                }
              }}
            >
              {Array.from({ length: maxRows }).map((_, row) =>
                Array.from({ length: maxCols }).map((_, col) => (
                  <button
                    type="button"
                    aria-label={`Select ${row + 1} rows and ${col + 1} columns`}
                    key={`${row}-${col}`}
                    onMouseEnter={() => handleHover(row, col)}
                    onClick={() => handleCellClick(row, col)}
                    className={cn(
                      "xs:size-4 size-5 cursor-pointer rounded-sm border",
                      "bg-transparent p-0", // reset button styles
                      hoverCell &&
                        row <= hoverCell.row &&
                        col <= hoverCell.col &&
                        "bg-muted", // the highlight
                    )}
                  />
                )),
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="table-wrap w-full">
            <div
              className="gridly-table-borders grid text-xs!"
              style={{
                gridTemplateColumns: `80px repeat(${selectedGrid.cols}, minmax(100px, auto))`,
                gridAutoRows: "minmax(40px, auto)",
                "--rows": selectedGrid.rows + 1,
                "--cols": selectedGrid.cols + 1,
              }}
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
                  <Input
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
                    className="border-primary rounded-none border-x-0 border-t-0 border-b-2 p-2"
                  />
                ) : (
                  <div
                    key={`col-header-${colId}`}
                    onClick={() =>
                      setEditingHeading({ type: "col", id: colId })
                    }
                    className="flex-center cursor-pointer bg-amber-700/30 p-2 font-bold uppercase"
                  >
                    {colHeadings[colId] || colId}
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
                    <Input
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
                      className="border-primary h-full! w-max! rounded-none border-x-0 border-t-0 border-b-2 p-2"
                    />
                  ) : (
                    <div
                      key={`row-header-${rowId}`}
                      onClick={() =>
                        setEditingHeading({ type: "row", id: rowId })
                      }
                      className="flex-center cursor-pointer bg-amber-700/70 p-2 font-bold"
                    >
                      {rowHeadings[rowId] || rowId}
                    </div>
                  ),
                  // Data cells for this row
                  ...Array.from({ length: selectedGrid.cols }).map((_, col) => {
                    const colId = toA1Col(col);
                    const cellId = `${colId}-${rowId}`;
                    return (
                      <Popover key={`cell-${cellId}`}>
                        <PopoverTrigger
                          render={
                            <div className="flex-center relative cursor-pointer p-2 [&:hover_.edit-icon]:opacity-100"></div>
                          }
                        >
                          <span>{cellId}</span>
                          <div className="flex-center bg-card/60 edit-icon pointer-events-none absolute inset-x-2 inset-y-1 z-100 rounded-sm opacity-0 backdrop-blur-sm duration-100">
                            <HugeiconsIcon
                              icon={PencilEdit02Icon}
                              strokeWidth={2}
                              className="text-muted-foreground size-5"
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="flex flex-col gap-2 text-sm">
                            <p className="flex flex-row flex-wrap items-center gap-1">
                              <code className="font-semibold">
                                {rowHeadings[rowId] || rowId}
                              </code>
                              <HugeiconsIcon
                                icon={X}
                                strokeWidth={2}
                                className="text-muted-foreground size-3"
                              />
                              <code className="font-semibold">
                                {colHeadings[colId] || colId}
                              </code>
                            </p>
                            <p>
                              <span className="font-semibold">ID:</span>{" "}
                              {cellId.split("-").join("")}
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
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
