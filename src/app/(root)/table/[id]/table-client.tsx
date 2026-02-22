"use client";

import {
  TableData,
  TableTheme,
  TableAlignment,
  ColumnHeadings,
  RowHeadings,
  GridCells,
} from "../../new/new-grid-page";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, toA1Col } from "@/lib/utils";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, useEffect, useState } from "react";
import { toast } from "sonner";
import { GridCell } from "../../new/grid-cell";
import { GridToolbar } from "../../new/grid-toolbar";
import { EditListDialog, Item } from "../../new/edit-list-dialog";
import { ThemeSelector } from "../../new/theme-selector";

export function TableClient({ table }: { table: TableData }) {
  const [tableData, setTableData] = useState<TableData>(table);

  const hasChanges = JSON.stringify(table) !== JSON.stringify(tableData);

  const [editingHeading, setEditingHeading] = useState<{
    type: "col" | "row";
    id: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    cellId: string;
    content: string;
  } | null>(null);

  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [appearanceExpanded, setAppearanceExpanded] = useState<boolean>(false);
  const [descriptionInDialog, setDescriptionInDialog] = useState<string>(
    tableData.description || "",
  );
  const [selectedThemeInDialog, setSelectedThemeInDialog] =
    useState<TableTheme>(tableData.style.theme);
  const [selectedAlignInDialog, setSelectedAlignInDialog] =
    useState<TableAlignment>(tableData.style.alignment);
  const [selectedOutlineInDialog, setSelectedOutlineInDialog] =
    useState<boolean>(tableData.style.outline);

  const [editRowsDialogOpen, setEditRowsDialogOpen] = useState(false);
  const [editColsDialogOpen, setEditColsDialogOpen] = useState(false);
  const [rowItems, setRowItems] = useState<Item[]>([]);
  const [colItems, setColItems] = useState<Item[]>([]);

  const [themeSelectorOpen, setThemeSelectorOpen] = useState<boolean>(false);

  const maxRows = 14;
  const maxCols = 12;

  useEffect(() => {
    const newRowItems = Array.from({ length: tableData.config.rows }).map(
      (_, i) => {
        const rowId = (i + 1).toString();
        return { id: rowId, value: tableData.rowHeadings[rowId] || "" };
      },
    );
    setRowItems(newRowItems);

    const newColItems = Array.from({ length: tableData.config.cols }).map(
      (_, i) => {
        const colId = toA1Col(i);
        return { id: colId, value: tableData.colHeadings[colId] || "" };
      },
    );
    setColItems(newColItems);
  }, [tableData]);

  const handleSaveChanges = () => {
    try {
      const tableJson = JSON.stringify(tableData);
      localStorage.setItem(`table-${tableData.id}`, tableJson);
      toast.success("Table saved successfully!");
    } catch (err) {
      toast.error("An error occurred while saving the table.");
    }
  };

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
    setTableData((prev) => ({
      ...prev,
      description: description,
      style: {
        ...prev.style,
        theme,
        alignment,
        outline,
      },
    }));
    setOptionsDialogOpen(false);
  };

  const handleSaveRows = (newItems: Item[]) => {
    const newRowCount = newItems.length;
    const oldRowCount = tableData.config.rows;

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
        for (let c = 0; c < tableData.config.cols; c++) {
          const colId = toA1Col(c);
          const oldCellId = `${colId}-${oldRowId}`;
          const newCellId = `${colId}-${newRowId}`;
          if (tableData.cells[oldCellId]) {
            newCells[newCellId] = tableData.cells[oldCellId];
          }
        }
      }
    }

    setTableData((prev) => ({
      ...prev,
      config: { ...prev.config, rows: newRowCount },
      rowHeadings: newRowHeadings,
      cells: newCells,
    }));
    setEditRowsDialogOpen(false);
  };

  const handleSaveCols = (newItems: Item[]) => {
    const newColCount = newItems.length;
    const oldColCount = tableData.config.cols;

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
        for (let r = 1; r <= tableData.config.rows; r++) {
          const rowId = r.toString();
          const oldCellId = `${oldColId}-${rowId}`;
          const newCellId = `${newColId}-${rowId}`;
          if (tableData.cells[oldCellId]) {
            newCells[newCellId] = tableData.cells[oldCellId];
          }
        }
      }
    }

    setTableData((prev) => ({
      ...prev,
      config: { ...prev.config, cols: newColCount },
      colHeadings: newColHeadings,
      cells: newCells,
    }));
    setEditColsDialogOpen(false);
  };

  return (
    <>
      <ThemeSelector
        tableTheme={tableData.style.theme}
        setTableTheme={(val: TableTheme) =>
          setTableData((p) => ({ ...p, style: { ...p.style, theme: val } }))
        }
        themeSelectorOpen={themeSelectorOpen}
        setThemeSelectorOpen={setThemeSelectorOpen}
      />

      <section className="flex flex-row items-center justify-between gap-5 overflow-x-clip">
        <GridToolbar
          tableId={tableData.id}
          tableName={tableData.name}
          setTableName={(name) =>
            setTableData((prev) => ({ ...prev, name: name }))
          }
          optionsDialogOpen={optionsDialogOpen}
          setOptionsDialogOpen={setOptionsDialogOpen}
          tableTheme={tableData.style.theme}
          selectedGrid={tableData.config}
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
          onSave={handleSaveChanges}
          isSaveDisabled={!hasChanges}
          editRowsDialogOpen={editRowsDialogOpen}
          setEditRowsDialogOpen={setEditRowsDialogOpen}
          editColsDialogOpen={editColsDialogOpen}
          setEditColsDialogOpen={setEditColsDialogOpen}
          setThemeSelectorOpen={setThemeSelectorOpen}
        />
      </section>

      <Separator />

      <EditListDialog
        open={editRowsDialogOpen}
        onOpenChange={setEditRowsDialogOpen}
        title="Edit Rows"
        items={rowItems}
        maxItems={maxRows}
        onItemsChange={(newItems) => setRowItems(newItems)}
        onSave={() => handleSaveRows(rowItems)}
      />

      <EditListDialog
        open={editColsDialogOpen}
        onOpenChange={setEditColsDialogOpen}
        title="Edit Columns"
        items={colItems}
        maxItems={maxCols}
        onItemsChange={(newItems) => setColItems(newItems)}
        onSave={() => handleSaveCols(colItems)}
      />

      <section className="overflow-x-clip px-0! py-2.5">
        <ScrollArea className="table-wrap w-full">
          <div className="mx-3 w-max border-2 border-dashed p-3">
            {tableData.name && (
              <h3 className="font-heading mb-2">{tableData.name}</h3>
            )}
            <section
              className={cn(
                "relative h-max w-max",
                "[&:hover>.new-line]:pointer-events-auto [&:hover>.new-line]:opacity-100",
              )}
            >
              <div
                className={cn(
                  "gridly-table not-last:mb-2",
                  tableData.style.theme,
                  `align-cell-${tableData.style.alignment}`,
                  !tableData.style.outline && "no-outline",
                )}
                style={
                  {
                    gridTemplateColumns: `minmax(80px, auto) repeat(${tableData.config.cols}, minmax(60px, auto))`,
                    gridAutoRows: "minmax(40px, auto)",
                    "--rows": tableData.config.rows + 1,
                    "--cols": tableData.config.cols + 1,
                  } as CSSProperties
                }
              >
                <div className="bg-transparent" />

                {Array.from({ length: tableData.config.cols }).map((_, col) => {
                  const colId = toA1Col(col);
                  const isEditing =
                    editingHeading?.type === "col" &&
                    editingHeading?.id === colId;
                  return isEditing ? (
                    <div key={`col-header-${colId}`} className="relative">
                      <input
                        key={`col-header-input-${colId}`}
                        type="text"
                        value={tableData.colHeadings[colId] || ""}
                        onChange={(e) =>
                          setTableData((prev) => ({
                            ...prev,
                            colHeadings: {
                              ...prev.colHeadings,
                              [colId]: e.target.value,
                            },
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
                      <span>{tableData.colHeadings[colId] || colId}</span>
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

                {Array.from({ length: tableData.config.rows }).flatMap(
                  (_, row) => {
                    const rowId = (row + 1).toString();
                    const isEditingRow =
                      editingHeading?.type === "row" &&
                      editingHeading?.id === rowId;

                    return [
                      isEditingRow ? (
                        <div
                          className="relative"
                          key={`row-header-input-${rowId}`}
                        >
                          <input
                            type="text"
                            value={tableData.rowHeadings[rowId] || ""}
                            onChange={(e) =>
                              setTableData((prev) => ({
                                ...prev,
                                rowHeadings: {
                                  ...prev.rowHeadings,
                                  [rowId]: e.target.value,
                                },
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
                          <span>{tableData.rowHeadings[rowId] || rowId}</span>
                          <div className="flex-center bg-card/60 edit-icon pointer-events-none absolute inset-1 z-100 rounded-sm opacity-0 backdrop-blur-sm duration-100">
                            <HugeiconsIcon
                              icon={PencilEdit02Icon}
                              strokeWidth={2}
                              className="text-muted-foreground size-4"
                            />
                          </div>
                        </div>
                      ),
                      ...Array.from({ length: tableData.config.cols }).map(
                        (_, col) => {
                          const colId = toA1Col(col);
                          const cellId = `${colId}-${rowId}`;
                          const cellData = tableData.cells[cellId];
                          const isEditingCell = editingCell?.cellId === cellId;

                          return (
                            <GridCell
                              key={`cell-${cellId}`}
                              cellId={cellId}
                              cellData={cellData}
                              rowHeader={tableData.rowHeadings[rowId] || rowId}
                              colHeader={tableData.colHeadings[colId] || colId}
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
                                setTableData((prev) => ({
                                  ...prev,
                                  cells: {
                                    ...prev.cells,
                                    [cellId]: {
                                      ...prev.cells[cellId],
                                      content: editingCell.content,
                                    },
                                  },
                                }));
                                setEditingCell(null);
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
              {tableData.description && (
                <p className="text-muted-foreground max-w-145 text-right text-sm">
                  {tableData.description}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </section>
    </>
  );
}
