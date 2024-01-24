import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { SearchCircle } from "~/shared/assets/icons";
import { cn } from "~/shared/lib/cn";

const inputVariants = cva(
  "border-gray2 bg-gray4 text-gray1 disabled:bg-gray4/90 flex-[1_0_0] self-stretch rounded-lg border outline-none disabled:text-gray-500",
  {
    variants: {
      destructive: {
        true: "border-red-300 focus-within:ring-[#FEE4E2]",
        false: "",
      },
      size: {
        md: "min-h-[46px] px-4 py-3.5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
      destructive: false,
    },
  },
);

interface InputProps<T extends string>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  className?: string;
  type?: "text" | "email" | "search";
  label?: string;
  name: T;
  value: string;
  onValue: ({ value, name }: { value: string; name: T }) => void;
  hint?: string;
  error?: ReactNode | null;
}

export const Input = <T extends string>({
  className,
  type = "text",
  label,
  name,
  size,
  value,
  onValue,
  hint,
  error,
  disabled,
  ...rest
}: InputProps<T>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    onValue({ value, name: name as T });
  };

  const hasError = Boolean(error);

  return label ? (
    <label
      className={cn(
        "flex flex-col items-start gap-1.5 self-stretch",
        className,
      )}
    >
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        aria-disabled={disabled}
        onChange={handleChange}
        className={cn(
          inputVariants({
            size,
            destructive: hasError,
          }),
        )}
        {...rest}
      />
      {hasError ? (
        <span className="self-stretch text-sm text-red-500">{error}</span>
      ) : (
        hint && <span className="self-stretch text-sm text-white">{hint}</span>
      )}
    </label>
  ) : (
    <div
      className={cn(
        "relative flex flex-col items-start gap-1.5 self-stretch",
        className,
      )}
    >
      {type === "search" ? (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchCircle />
        </div>
      ) : null}
      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        aria-disabled={disabled}
        onChange={handleChange}
        className={cn(
          inputVariants({
            size,
            destructive: hasError,
          }),
          type === "search" && "pl-[42px]",
        )}
        {...rest}
      />
      {hasError ? (
        <span className="self-stretch text-sm text-red-500">{error}</span>
      ) : (
        hint && <span className="self-stretch text-sm text-white">{hint}</span>
      )}
    </div>
  );
};
