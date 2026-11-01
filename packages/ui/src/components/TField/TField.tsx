import * as Label from "@radix-ui/react-label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { cn } from "../../lib/cn";
import { TButton } from "../TButton";
import { TIcon } from "../TIcon";
import { TInput } from "../TInput";
import {
  tFieldControlClasses,
  tFieldHintVariants,
  tFieldLabelClasses,
  tFieldRevealClasses,
  tFieldRootClasses,
} from "./TField.variants";
import type { TFieldProps } from "./types";

export function TField({
  label,
  description,
  error,
  revealLabel = "Show password",
  id,
  className,
  ...inputProps
}: TFieldProps) {
  // useId() is not enough here: every custom element is its own React root and ids restart per root,
  // so two <t-field>s on one page would share an id. A uuid is unique page-wide; the lazy initializer
  // generates it once, so it stays stable across re-renders.
  const [generatedId] = useState(() => `t-field-${uuid()}`);
  const [revealed, setRevealed] = useState(false);

  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const hint = error ?? description;
  const password = inputProps.type === "password";

  const input = (
    <TInput
      id={inputId}
      invalid={!!error}
      aria-describedby={hint ? hintId : undefined}
      data-slot="field-input"
      {...inputProps}
      type={password && revealed ? "text" : inputProps.type}
    />
  );

  return (
    <div className={cn(tFieldRootClasses, className)}>
      <Label.Root htmlFor={inputId} className={tFieldLabelClasses}>
        {label}
      </Label.Root>
      {password ? (
        // A password input gets a toggle that shows its text. aria-pressed carries the state, so the
        // button keeps one name.
        <div className={tFieldControlClasses}>
          {input}
          <TButton
            type="button"
            variant="ghost"
            size="sm"
            aria-label={revealLabel}
            aria-controls={inputId}
            aria-pressed={revealed}
            disabled={inputProps.disabled}
            className={tFieldRevealClasses}
            onClick={() => setRevealed((value) => !value)}
          >
            <TIcon icon={revealed ? EyeOff : Eye} size="sm" />
          </TButton>
        </div>
      ) : (
        input
      )}
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
