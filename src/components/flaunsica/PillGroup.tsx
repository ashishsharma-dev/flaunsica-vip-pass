import { cn } from "@/lib/utils";

interface PillGroupProps {
  legend: string;
  options: readonly string[];
  value: string[];
  multi?: boolean;
  onChange: (next: string[]) => void;
  error?: string;
}

export function PillGroup({
  legend,
  options,
  value,
  multi = false,
  onChange,
  error,
}: PillGroupProps) {
  const toggle = (option: string) => {
    if (multi) {
      onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
    } else {
      onChange(value[0] === option ? [] : [option]);
    }
  };

  return (
    <fieldset>
      <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={active}
              onClick={() => toggle(option)}
              className={cn("pill-luxe", active && "pill-luxe-active")}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </fieldset>
  );
}
