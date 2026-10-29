import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { cn } from "../../lib/cn";
import { TInput } from "../TInput";
import {
  tFieldHintVariants,
  tFieldLabelClasses,
  tFieldRootClasses,
} from "./TField.variants";
import type { TFieldProps } from "./types";

export function TField({
  label,
  description,
  error,
  id,
  className,
  ...inputProps
}: TFieldProps) {
  // useId() is not enough here: every custom element is its own React root and ids restart per root,
  // so two <t-field>s on one page would share an id. A uuid is unique page-wide; the lazy initializer
  // generates it once, so it stays stable across re-renders.
  const [generatedId] = useState(() => `t-field-${uuid()}`);

  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const hint = error ?? description;

  return (
    <div className={cn(tFieldRootClasses, className)}>
      <Label.Root htmlFor={inputId} className={tFieldLabelClasses}>
        {label}
      </Label.Root>
      <TInput
        id={inputId}
        invalid={!!error}
        aria-describedby={hint ? hintId : undefined}
        {...inputProps}
      />
      {hint && (
        <p
          id={hintId}
          role={error ? "alert" : undefined}
          className={tFieldHintVariants({
            tone: error ? "error" : "description",
          })}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
