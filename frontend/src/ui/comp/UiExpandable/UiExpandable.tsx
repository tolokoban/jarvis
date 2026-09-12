import React from "react";
import { Theme } from "@tolokoban/ui";

import Styles from "./UiExpandable.module.css";

const $ = Theme.classNames;

export interface UiExpandableProps {
  className?: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

export function UiExpandable({ className, label, children }: UiExpandableProps) {
  return (
    <details className={$.join(className, Styles.expandable)}>
      <summary>{label}</summary>
      <div>{children}</div>
    </details>
  );
}
