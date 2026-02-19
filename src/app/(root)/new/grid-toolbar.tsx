import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  FloppyDiskIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  alignment,
  maxDescriptionLength,
  TableAlignment,
  TableTheme,
  themes,
} from "./new-grid-page";

interface GridToolbarProps {
  tableId?: string;
  tableName: string;
  setTableName: (name: string) => void;
  optionsDialogOpen: boolean;
  setOptionsDialogOpen: (open: boolean) => void;
  tableTheme: TableTheme;
  selectedGrid: { rows: number; cols: number } | null;
  descriptionInDialog: string;
  setDescriptionInDialog: (description: string) => void;
  appearanceExpanded: boolean;
  setAppearanceExpanded: (
    expanded: boolean | ((e: boolean) => boolean),
  ) => void;
  selectedThemeInDialog: TableTheme;
  setSelectedThemeInDialog: (theme: TableTheme) => void;
  selectedAlignInDialog: TableAlignment;
  setSelectedAlignInDialog: (alignment: TableAlignment) => void;
  selectedOutlineInDialog: boolean;
  setSelectedOutlineInDialog: (outline: boolean) => void;
  updateTableOptions: (options: {
    theme: TableTheme;
    description: string;
    alignment: TableAlignment;
    outline: boolean;
  }) => void;
  onSave: () => void;
  isSaveDisabled?: boolean;
  editRowsDialogOpen: boolean;
  setEditRowsDialogOpen: (open: boolean) => void;
  editColsDialogOpen: boolean;
  setEditColsDialogOpen: (open: boolean) => void;
}

export function GridToolbar({
  tableId,
  tableName,
  setTableName,
  optionsDialogOpen,
  setOptionsDialogOpen,
  tableTheme,
  selectedGrid,
  descriptionInDialog,
  setDescriptionInDialog,
  appearanceExpanded,
  setAppearanceExpanded,
  selectedThemeInDialog,
  setSelectedThemeInDialog,
  selectedAlignInDialog,
  setSelectedAlignInDialog,
  selectedOutlineInDialog,
  setSelectedOutlineInDialog,
  updateTableOptions,
  onSave,
  isSaveDisabled,
  setEditRowsDialogOpen,
  setEditColsDialogOpen,
}: GridToolbarProps) {
  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col justify-center gap-3",
          "md:flex-row md:items-center md:justify-between",
        )}
      >
        <section className="flex flex-1 flex-row items-center gap-3">
          {/* Table name */}
          <div
            className={cn(
              "has-[input:focus]:border-primary relative h-10 w-full max-w-105 min-w-55 flex-1 rounded-lg border-2 p-2 duration-100",
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
        </section>

        <section
          className={cn(
            "h-0 overflow-clip duration-190",
            "xs:h-max flex flex-row items-start gap-3",
          )}
        >
          <div className="flex items-center gap-3">
            {/* Edit buttons */}
            <Button
              variant="secondary"
              className="h-10"
              disabled={!selectedGrid}
              onClick={() => setEditColsDialogOpen(true)}
            >
              Edit Columns
            </Button>
            <Button
              variant="secondary"
              className="h-10"
              disabled={!selectedGrid}
              onClick={() => setEditRowsDialogOpen(true)}
            >
              Edit Rows
            </Button>

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
              onClick={onSave}
              disabled={isSaveDisabled}
            >
              <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
              <span className="hidden sm:inline-block">
                {tableId ? "Update" : "Save"}
              </span>
            </Button>
          </div>
        </section>
      </div>

      <div
        className={cn(
          "bg-background fixed bottom-0 left-0 z-999 flex h-12 w-full items-end justify-center gap-px overflow-clip border-t duration-190",
          "[&>button:not(:last-child)]:border-r",
          "xs:h-0",
          !selectedGrid && "h-0!",
        )}
      >
        <button
          onClick={() => setEditRowsDialogOpen(true)}
          className="flex-center bg-background text-muted-foreground hover:text-foreground h-full w-full flex-row gap-1 text-sm"
        >
          Rows
        </button>

        <button
          onClick={() => setEditColsDialogOpen(true)}
          className="flex-center bg-background text-muted-foreground hover:text-foreground h-full w-full flex-row gap-1 text-sm"
        >
          Columns
        </button>

        <button
          onClick={() => setEditColsDialogOpen(true)}
          className="flex-center bg-background text-muted-foreground hover:text-foreground h-full w-full flex-row gap-1 text-sm"
        >
          Theme
        </button>

        <button
          onClick={() => setOptionsDialogOpen(true)}
          className="flex-center bg-background text-muted-foreground hover:text-foreground h-full w-full flex-row gap-1 text-sm"
        >
          Config
        </button>

        <button
          onClick={onSave}
          className={cn(
            "flex-center bg-background text-muted-foreground hover:text-foreground h-full w-full flex-row gap-1 text-sm",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
          disabled={isSaveDisabled}
        >
          {/*<HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />*/}

          {tableId ? "Update" : "Save"}
        </button>
      </div>
    </>
  );
}
