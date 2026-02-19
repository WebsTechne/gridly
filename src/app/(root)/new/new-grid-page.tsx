"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, toA1Col } from "@/lib/utils";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, useEffect, useState } from "react";

import { toast } from "sonner";
import { EditListDialog, type Item } from "./edit-list-dialog";
export type { Item };
import { GridCell } from "./grid-cell";
import { GridSelector } from "./grid-selector";

import { useRouter } from "next/navigation";
import { GridToolbar } from "./grid-toolbar";

export type TableTheme = "amber" | "classic" | "blue" | "excel" | "dafe";
export type TableAlignment = "left" | "center" | "right";

export type TagId = "red-dot" | "blue-dot" | "green-dot";

export type Tags = {
  id: TagId;
  description: string;
};

export type CellData = {
  label?: string;
  content?: string;
  tags?: TagId[];
};

export type ColumnHeadings = { [colId: string]: string }; // e.g., { 'A': 'Monday', 'B': 'Tuesday' }
export type RowHeadings = { [rowId: string]: string }; // e.g., { '1': '8:00 AM', '2': '9:00 AM' }
export type GridCells = { [cellId: string]: CellData }; // e.g., { 'A-1': { label: 'Math' } }

export type TableData = {
  id: string;
  name: string;
  description?: string;
  style: {
    theme: TableTheme;
    alignment: TableAlignment;
    outline: boolean;
  };
  config: {
    rows: number;
    cols: number;
  };
  colHeadings: ColumnHeadings;
  rowHeadings: RowHeadings;
  cells: GridCells;
  tags?: Tags[];
};

export const maxDescriptionLength = 200;

export const themes = [
  { id: "amber", label: "Amber" },
  { id: "classic", label: "Classic" },
  { id: "blue", label: "Blue" },
  { id: "excel", label: "Excel" },
  { id: "dafe", label: "Dafe" },
];

export const alignment = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

export function NewGridPage() {
  const router = useRouter();

  const [tableName, setTableName] = useState("");
  const [tableDescription, setTableDescription] = useState("");
  const [tableTheme, setTableTheme] = useState<TableTheme>("amber");
  const [tableAlignment, setTableAlignment] =
    useState<TableAlignment>("center");
  const [tableOutline, setTableOutline] = useState<boolean>(true);

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

  const [tableTags, setTableTags] = useState<Tags[]>([]);

  const handleCreateTable = (rows: number, cols: number) => {
    setSelectedGrid({ rows, cols });
  };

  const handleSaveTable = () => {
    if (!selectedGrid) {
      return;
    }

    // generate unique table ID
    // get table name
    const newTableId = crypto.randomUUID();

    // gather data
    const tableToSave: TableData = {
      id: newTableId,
      name: tableName || "Untitled Table",
      description: tableDescription,
      style: {
        theme: tableTheme,
        alignment: tableAlignment,
        outline: tableOutline,
      },
      config: {
        rows: selectedGrid.rows,
        cols: selectedGrid.cols,
      },
      colHeadings: colHeadings,
      rowHeadings: rowHeadings,
      cells: cells,
      tags: tableTags,
    };

    try {
      // convert to JSON and store in localStorage
      const tableJson = JSON.stringify(tableToSave);
      localStorage.setItem(`table-${newTableId}`, tableJson);

      // add table ID to list of all table IDs
      const allTableIds = JSON.parse(
        localStorage.getItem("gridly-tables") || "[]",
      );
      localStorage.setItem(
        "gridly-tables",
        JSON.stringify([...allTableIds, newTableId]),
      );

      toast.success("Table saved successfully!");

      router.push(`/table/${newTableId}`);
    } catch (err) {
      toast.error("An error occurred while saving the table.");
    }
  };

  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [appearanceExpanded, setAppearanceExpanded] = useState<boolean>(false);
  const [descriptionInDialog, setDescriptionInDialog] =
    useState<string>(tableDescription);
  const [selectedThemeInDialog, setSelectedThemeInDialog] =
    useState<TableTheme>(tableTheme);
  const [selectedAlignInDialog, setSelectedAlignInDialog] =
    useState<TableAlignment>(tableAlignment);
  const [selectedOutlineInDialog, setSelectedOutlineInDialog] =
    useState<boolean>(tableOutline);

  const [editRowsDialogOpen, setEditRowsDialogOpen] = useState(false);
  const [editColsDialogOpen, setEditColsDialogOpen] = useState(false);
  const [rowItems, setRowItems] = useState<Item[]>([]);
  const [colItems, setColItems] = useState<Item[]>([]);

  const updateTableOptions = ({
    theme,
    description,
    alignment,
    outline,
  }: {
    theme: TableTheme;
    description: string;
    alignment: TableAlignment;
    outline: boolean;
  }) => {
    // set table theme and description
    setTableTheme(theme);
    setTableDescription(description);
    setTableAlignment(alignment);
    setTableOutline(outline);
    // close dialog
    setOptionsDialogOpen(false);
  };

  useEffect(() => {
    if (selectedGrid) {
      const newRowItems = Array.from({ length: selectedGrid.rows }).map(
        (_, i) => {
          const rowId = (i + 1).toString();
          return { id: rowId, value: rowHeadings[rowId] || "" };
        },
      );
      setRowItems(newRowItems);

      const newColItems = Array.from({ length: selectedGrid.cols }).map(
        (_, i) => {
          const colId = toA1Col(i);
          return { id: colId, value: colHeadings[colId] || "" };
        },
      );
      setColItems(newColItems);
    }
  }, [selectedGrid, rowHeadings, colHeadings]);

  const handleSaveRows = (newItems: Item[]) => {
    if (!selectedGrid) return;

    const newRowCount = newItems.length;
    const oldRowCount = selectedGrid.rows;

    const newRowHeadings: RowHeadings = {};
    newItems.forEach((item, i) => {
      newRowHeadings[(i + 1).toString()] = item.value;
    });

    const newCells: GridCells = {};
    const oldIdToNewId = new Map<string, string>();
    newItems.forEach((item, i) => {
      if (!item.id.startsWith("new-")) {
        oldIdToNewId.set(item.id, (i + 1).toString());
      }
    });

    for (let r = 1; r <= oldRowCount; r++) {
      const oldRowId = r.toString();
      const newRowId = oldIdToNewId.get(oldRowId);
      if (newRowId) {
        for (let c = 0; c < selectedGrid.cols; c++) {
          const colId = toA1Col(c);
          const oldCellId = `${colId}-${oldRowId}`;
          const newCellId = `${colId}-${newRowId}`;
          if (cells[oldCellId]) {
            newCells[newCellId] = cells[oldCellId];
          }
        }
      }
    }

    setSelectedGrid((prev) => (prev ? { ...prev, rows: newRowCount } : null));
    setRowHeadings(newRowHeadings);
    setCells(newCells);
    setEditRowsDialogOpen(false);
  };

  const handleSaveCols = (newItems: Item[]) => {
    if (!selectedGrid) return;

    const newColCount = newItems.length;
    const oldColCount = selectedGrid.cols;

    const newColHeadings: ColumnHeadings = {};
    newItems.forEach((item, i) => {
      newColHeadings[toA1Col(i)] = item.value;
    });

    const newCells: GridCells = {};
    const oldIdToNewId = new Map<string, string>();
    newItems.forEach((item, i) => {
      if (!item.id.startsWith("new-")) {
        oldIdToNewId.set(item.id, toA1Col(i));
      }
    });

    for (let c = 0; c < oldColCount; c++) {
      const oldColId = toA1Col(c);
      const newColId = oldIdToNewId.get(oldColId);
      if (newColId) {
        for (let r = 1; r <= selectedGrid.rows; r++) {
          const rowId = r.toString();
          const oldCellId = `${oldColId}-${rowId}`;
          const newCellId = `${newColId}-${rowId}`;
          if (cells[oldCellId]) {
            newCells[newCellId] = cells[oldCellId];
          }
        }
      }
    }

    setSelectedGrid((prev) => (prev ? { ...prev, cols: newColCount } : null));
    setColHeadings(newColHeadings);
    setCells(newCells);
    setEditColsDialogOpen(false);
  };

  return (
    <>
      <section className="flex flex-row items-center justify-between gap-5 overflow-x-clip">
        {/*<h1 className="heading">New Table</h1>*/}

        <GridToolbar
          tableName={tableName}
          setTableName={setTableName}
          optionsDialogOpen={optionsDialogOpen}
          setOptionsDialogOpen={setOptionsDialogOpen}
          tableTheme={tableTheme}
          selectedGrid={selectedGrid}
          descriptionInDialog={descriptionInDialog}
          setDescriptionInDialog={setDescriptionInDialog}
          appearanceExpanded={appearanceExpanded}
          setAppearanceExpanded={setAppearanceExpanded}
          selectedThemeInDialog={selectedThemeInDialog}
          setSelectedThemeInDialog={setSelectedThemeInDialog}
          selectedAlignInDialog={selectedAlignInDialog}
          setSelectedAlignInDialog={setSelectedAlignInDialog}
          selectedOutlineInDialog={selectedOutlineInDialog}
          setSelectedOutlineInDialog={setSelectedOutlineInDialog}
          updateTableOptions={updateTableOptions}
          onSave={handleSaveTable}
          editRowsDialogOpen={editRowsDialogOpen}
          setEditRowsDialogOpen={setEditRowsDialogOpen}
          editColsDialogOpen={editColsDialogOpen}
          setEditColsDialogOpen={setEditColsDialogOpen}
        />
      </section>

      <Separator />

      <EditListDialog
        open={editRowsDialogOpen}
        onOpenChange={setEditRowsDialogOpen}
        title="Edit Rows"
        items={rowItems}
        maxItems={maxRows}
        onItemsChange={setRowItems}
        onSave={() => handleSaveRows(rowItems)}
      />

      <EditListDialog
        open={editColsDialogOpen}
        onOpenChange={setEditColsDialogOpen}
        title="Edit Columns"
        items={colItems}
        maxItems={maxCols}
        onItemsChange={setColItems}
        onSave={() => handleSaveCols(colItems)}
      />

      <section
        className={cn("overflow-x-clip px-0! py-2.5", selectedGrid && "")}
      >
        {!selectedGrid ? (
          <GridSelector
            onCreateTable={handleCreateTable}
            maxRows={maxRows}
            maxCols={maxCols}
          />
        ) : (
          <ScrollArea className="table-wrap w-full">
            <div className="mx-3 w-max border-2 p-3">
              {tableName && <h3 className="font-heading mb-2">{tableName}</h3>}
              <section
                className={cn(
                  "relative h-max w-max",
                  "[&:hover>.new-line]:pointer-events-auto [&:hover>.new-line]:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "gridly-table not-last:mb-2",
                    tableTheme,
                    `align-cell-${tableAlignment}`,
                    !tableOutline && "no-outline",
                  )}
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
                  <div className="bg-transparent" />

                  {/* Column Headers */}
                  {Array.from({ length: selectedGrid.cols }).map((_, col) => {
                    const colId = toA1Col(col);
                    const isEditing =
                      editingHeading?.type === "col" &&
                      editingHeading?.id === colId;
                    return isEditing ? (
                      <div key={`col-header-${colId}`} className="relative">
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
                  {Array.from({ length: selectedGrid.rows }).flatMap(
                    (_, row) => {
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
                        ...Array.from({ length: selectedGrid.cols }).map(
                          (_, col) => {
                            const colId = toA1Col(col);
                            const cellId = `${colId}-${rowId}`;
                            const cellData = cells[cellId];

                            const isEditingCell =
                              editingCell?.cellId === cellId;

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
                          },
                        ),
                      ];
                    },
                  )}
                </div>
              </section>

              <div className="flex flex-wrap justify-end not-last:mb-1">
                {tableDescription && (
                  <p className="text-muted-foreground max-w-145 text-right text-sm">
                    {tableDescription}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </section>
    </>
  );
}
