import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LuxeFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  prefix?: ReactNode;
  error?: string;
}

export const LuxeField = forwardRef<HTMLInputElement, LuxeFieldProps>(function LuxeField(
  { label, id, prefix, error, className, ...props },
  ref,
) {
  return (
    <div className="group relative">
      <div className="flex items-end">
        {prefix ? (
          <span className="pointer-events-none pb-[0.55rem] pr-2 text-base text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("field-luxe peer", error && "border-b-destructive", className)}
          {...props}
        />
      </div>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground transition-all duration-300 peer-placeholder-shown:top-[1.45rem] peer-placeholder-shown:text-[0.9rem] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-[0.22em] peer-focus:text-primary"
      >
        {label}
      </label>
      <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 peer-focus:w-full" />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
});
