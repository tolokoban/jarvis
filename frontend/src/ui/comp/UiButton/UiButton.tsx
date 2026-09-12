import React from "react";
import { Theme, ViewButton, ViewButtonProps } from "@tolokoban/ui";

import Styles from "./UiButton.module.css";

const $ = Theme.classNames;

export interface UiButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick(): void;
  enabled?: boolean;
  color?: ViewButtonProps["color"];
}

export function UiButton({ className, children, onClick, enabled = true, color }: UiButtonProps) {
  return (
    <ViewButton
      className={$.join(className, Styles.uiButton)}
      onClick={onClick}
      enabled={enabled}
      color={color}
    >
      {children}
    </ViewButton>
  );
}
