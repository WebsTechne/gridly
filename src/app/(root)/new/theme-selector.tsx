import { cn } from "@/lib/utils";
import { TableTheme, themes } from "./new-grid-page";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

const ThemeSelector = ({
  tableTheme,
  setTableTheme,
  themeSelectorOpen,
  setThemeSelectorOpen,
}: {
  tableTheme: string;
  setTableTheme: (theme: TableTheme) => void;
  themeSelectorOpen: boolean;
  setThemeSelectorOpen: (open: boolean) => void;
}) => {
  return (
    <div
      className={cn(
        "bg-background fixed top-0 left-0 z-1005 flex h-screen w-full flex-col items-center gap-4 overflow-y-auto pb-4 duration-250",
        themeSelectorOpen
          ? "pointer-events-auto opacity-100"
          : "blur-in-sm pointer-events-none opacity-0",
        "*:max-w-300 *:px-3",
      )}
    >
      <header className="bg-background sticky top-0 z-20 flex w-full items-center justify-between pt-4 pb-1">
        <h3 className="heading">Themes</h3>
        <button
          type="button"
          onClick={() => setThemeSelectorOpen(false)}
          className="flex-center size-6"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            className="text-muted-foreground hover:text-foreground size-5"
          />
        </button>
      </header>

      <section className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {themes.map((t) => {
          const active = t.id === tableTheme;

          return (
            <div
              key={t.id}
              onClick={() => {
                setTableTheme(t.id as TableTheme);
                setThemeSelectorOpen(false);
              }}
              className={cn(
                "theme-preview",
                active
                  ? "active border-primary text-foreground"
                  : "border-border text-muted-foreground",
                t.id,
              )}
            >
              <p
                className={cn(
                  "flex items-center justify-between p-1 text-sm",
                  t.label.length < 2 && "text-transparent!",
                )}
              >
                <span>{t.label.length > 1 ? t.label : "Rand"}</span>

                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className={cn(
                    "size-5 duration-200",
                    active
                      ? "text-primary opacity-100"
                      : "text-muted-foreground opacity-0 blur-md",
                  )}
                />
              </p>

              <div className="preview">
                <div className="colHead">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className="rowHead">
                  <div></div>
                  <div></div>
                </div>
                <div className="body">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export { ThemeSelector };
