"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormEvent, useEffect, useState } from "react";

interface GridSelectorProps {
  onCreateTable: (rows: number, cols: number) => void;
  maxRows: number;
  maxCols: number;
}

export function GridSelector({
  onCreateTable,
  maxRows,
  maxCols,
}: GridSelectorProps) {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [rowError, setRowError] = useState<string | null>(null);
  const [colError, setColError] = useState<string | null>(null);

  const [hoverCell, setHoverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isSelectionLocked, setSelectionLocked] = useState(false);

  useEffect(() => {
    if (rows < 1 || rows > maxRows) {
      setRowError(`Must be between 1 and ${maxRows}`);
    } else {
      setRowError(null);
    }
  }, [rows, maxRows]);

  useEffect(() => {
    if (cols < 1 || cols > maxCols) {
      setColError(`Must be between 1 and ${maxCols}`);
    } else {
      setColError(null);
    }
  }, [cols, maxCols]);

  const handleCellClick = (row: number, col: number) => {
    if (isSelectionLocked) {
      setSelectionLocked(false);
      handleHover(row, col);
    } else {
      setHoverCell({ row, col });
      setRows(row + 1);
      setCols(col + 1);
      setSelectionLocked(true);
    }
  };

  const handleHover = (row: number, col: number) => {
    if (isSelectionLocked) return;
    setHoverCell({ row, col });
    setRows(row + 1);
    setCols(col + 1);
  };

  const handleCreateTableClick = (e: FormEvent) => {
    e.preventDefault();

    if (rowError || colError) return;
    onCreateTable(rows, cols);
  };

  return (
    <div className="flex h-max flex-col gap-2 p-3 sm:flex-row sm:gap-3">
      {/* Input selector */}
      <form
        className="xs:max-w-110 flex w-full min-w-30 flex-col gap-4 sm:h-full sm:min-w-41 sm:border-r sm:px-1"
        onSubmit={(e) => handleCreateTableClick(e)}
      >
        <div className="xs:flex-row flex flex-col gap-4">
          <div className="flex flex-col gap-1">
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
                const newRows = Number(e.target.value);
                setRows(newRows);
                setSelectionLocked(false);
                setHoverCell({ row: newRows - 1, col: cols - 1 });
              }}
            />
            {rowError && <p className="text-xs text-red-500">{rowError}</p>}
          </div>
          <div className="flex flex-col gap-1">
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
                const newCols = Number(e.target.value);
                setCols(newCols);
                setSelectionLocked(false);
                setHoverCell({ row: rows - 1, col: newCols - 1 });
              }}
            />
            {colError && <p className="text-xs text-red-500">{colError}</p>}
          </div>
        </div>

        <Button
          type="submit"
          // onClick={handleCreateTableClick}
          disabled={rowError || colError ? true : false}
        >
          Create Table
        </Button>
      </form>

      {/* Grid selector */}
      <div
        className={cn(
          "hidden max-w-fit shrink-0 gap-1 sm:grid!",
          `grid-cols-[repeat(12,20px)] sm:grid-cols-[repeat(12,16px)]`,
        )}
        onMouseLeave={() => {
          if (!isSelectionLocked) {
            setHoverCell(null);
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
                "bg-transparent p-0",
                hoverCell &&
                  row <= hoverCell.row &&
                  col <= hoverCell.col &&
                  "bg-muted",
              )}
            />
          )),
        )}
      </div>
    </div>
  );
}
