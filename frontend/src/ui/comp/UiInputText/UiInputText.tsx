import React from "react";
import { Theme, ViewInputText, ViewLabel } from "@tolokoban/ui";

import Styles from "./UiInputText.module.css";

const $ = Theme.classNames;

export interface UiInputTextProps {
  className?: string;
  label?: string;
  value: string;
  onChange(value: string): void;
  onEnterKeyPressed?(value: string): void;
  password?: boolean;
  autofocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function UiInputText({
  className,
  label,
  value,
  onChange,
  onEnterKeyPressed,
  password = false,
  autofocus,
  ref,
}: UiInputTextProps) {
  return (
    <ViewLabel className={$.join(className, Styles.uiInputText)} value={label}>
      <ViewInputText
        value={value}
        onChange={onChange}
        onEnterKeyPressed={onEnterKeyPressed}
        type={password ? "password" : "text"}
        autofocus={autofocus}
        ref={ref}
      />
    </ViewLabel>
  );
}
