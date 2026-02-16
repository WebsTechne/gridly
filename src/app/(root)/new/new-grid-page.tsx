"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, toA1Col } from "@/lib/utils";
import {
  ChevronDown,
  FloppyDiskIcon,
  PencilEdit02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, useState } from "react";

import { GridCell } from "./grid-cell";
import { GridSelector } from "./grid-selector";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

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

export function NewGridPage() {
  const router = useRouter();

  const [tableName, setTableName] = useState("");
  const maxDescriptionLength = 200;
  const [tableDescription, setTableDescription] = useState("");
  const [tableTheme, setTableTheme] = useState<TableTheme>("amber");
  const [tableAlignment, setTableAlignment] =
    useState<TableAlignment>("center");
  const [tableOutline, setTableOutline] = useState<boolean>(true);

  const themes = [
    { id: "amber", label: "Amber" },
    { id: "classic", label: "Classic" },
    { id: "blue", label: "Blue" },
    { id: "excel", label: "Excel" },
    { id: "dafe", label: "Dafe" },
  ];

  const alignment = [
    { id: "left", label: "Left" },
    { id: "center", label: "Center" },
    { id: "right", label: "Right" },
  ];

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

      router.push(`/tables/${newTableId}`);
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

  return (
    <>
      <section className="flex flex-row items-center justify-between gap-5 overflow-x-clip">
        {/*<h1 className="heading">New Table</h1>*/}

        <div className="flex w-full flex-row items-center justify-between gap-3">
          {/* Table name */}
          <div
            className={cn(
              "has-[input:focus]:border-primary relative h-10 w-55 max-w-75 flex-1 rounded-lg border-2 p-2 duration-100",
              "[&:has(input:focus)>.name-label]:text-primary!",
              "[&:has(input:focus)>.name-label]:top-0! [&:has(input:not(:placeholder-shown))>.name-label]:top-0!",
              "[&:has(input:focus)>.name-label]:text-sm! [&:has(input:not(:placeholder-shown))>.name-label]:text-sm!",
            )}
          >
            <input
              value={tableName}
              onChange={(val) => setTableName(val.target.value)}
              placeholder=" "
              className="absolute inset-0 rounded-[inherit] border-none px-2 text-sm outline-none md:text-base"
            />
            <span className="bg-background text-muted-foreground flex-center name-label pointer-events-none absolute top-1/2 z-2 h-6 -translate-y-1/2 px-1 leading-0 duration-100">
              Table name
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* More options */}
            <AlertDialog
              open={optionsDialogOpen}
              onOpenChange={(open) => {
                setOptionsDialogOpen(open);
                if (open) {
                  setSelectedThemeInDialog(tableTheme);
                }
              }}
            >
              <AlertDialogTrigger
                render={
                  <Button
                    variant="secondary"
                    className="h-10"
                    disabled={selectedGrid ? false : true}
                  />
                }
              >
                <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
                <span className="hidden sm:inline-block">More options</span>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md!">
                <FieldGroup>
                  <Field className="w-full">
                    <FieldLabel htmlFor="descriptionInDialog">
                      Table description (optional)
                    </FieldLabel>
                    <Textarea
                      id="descriptionInDialog"
                      placeholder="Description"
                      value={descriptionInDialog}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.length <= maxDescriptionLength)
                          setDescriptionInDialog(v);
                      }}
                      className="max-w-full!"
                    ></Textarea>
                    <FieldError className="text-end">
                      <p className="text-muted-foreground! text-xs!">
                        {descriptionInDialog.length}/{maxDescriptionLength}
                      </p>
                    </FieldError>
                  </Field>
                </FieldGroup>

                <div className="h-max w-full">
                  <div
                    className="flex h-max w-full cursor-pointer items-center justify-between py-1"
                    onClick={() => setAppearanceExpanded((e) => !e)}
                  >
                    Appearance
                    <HugeiconsIcon
                      icon={ChevronDown}
                      strokeWidth={2}
                      className={cn(
                        "size-5 duration-200",
                        appearanceExpanded && "rotate-180",
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "overflow-clip border-l-2 px-0.5 pl-2 duration-200",
                      appearanceExpanded ? "h-max!" : "h-0",
                    )}
                  >
                    <FieldGroup>
                      {/* Choosing theme */}
                      <Field>
                        <FieldLabel className="text-muted-foreground!">
                          Choose a theme
                        </FieldLabel>
                        <Select
                          value={selectedThemeInDialog}
                          onValueChange={(theme) =>
                            setSelectedThemeInDialog(theme as TableTheme)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedThemeInDialog} />
                          </SelectTrigger>
                          <SelectContent sideOffset={0}>
                            {themes.map((theme) => (
                              <SelectItem key={theme.id} value={theme.id}>
                                {theme.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Alignment */}
                      <Field>
                        <FieldLabel className="text-muted-foreground!">
                          Alignment
                        </FieldLabel>
                        <Select
                          value={selectedAlignInDialog}
                          onValueChange={(al) =>
                            setSelectedAlignInDialog(al as TableAlignment)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedAlignInDialog} />
                          </SelectTrigger>
                          <SelectContent sideOffset={0}>
                            {alignment.map((align) => (
                              <SelectItem key={align.id} value={align.id}>
                                {align.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field orientation="horizontal">
                        <FieldLabel
                          htmlFor="outline-switch"
                          className="text-muted-foreground! cursor-pointer"
                        >
                          Outline
                        </FieldLabel>
                        <Switch
                          id="outline-switch"
                          checked={selectedOutlineInDialog}
                          className="cursor-pointer"
                          onCheckedChange={(checked) =>
                            setSelectedOutlineInDialog(checked)
                          }
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      updateTableOptions({
                        theme: selectedThemeInDialog,
                        description: descriptionInDialog,
                        alignment: selectedAlignInDialog,
                        outline: selectedOutlineInDialog,
                      })
                    }
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Save button */}
            <Button
              variant="default"
              className="h-10"
              onClick={handleSaveTable}
            >
              <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
              <span className="hidden sm:inline-block">Save</span>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

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
                    ...Array.from({ length: selectedGrid.cols }).map(
                      (_, col) => {
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
                      },
                    ),
                  ];
                })}
              </div>

              <div className="flex flex-wrap justify-end not-last:mb-1">
                {tableDescription && (
                  <p className="text-muted-foreground max-w-130 text-right text-sm">
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
