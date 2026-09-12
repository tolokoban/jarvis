import React from "react";
import { Theme } from "@tolokoban/ui";

import Styles from "./LayoutRowSpaceAround.module.css";

const $ = Theme.classNames;

export interface LayoutRowSpaceAroundProps {
  className?: string;
  children: React.ReactNode;
}

export function LayoutRowSpaceAround({ className, children }: LayoutRowSpaceAroundProps) {
  return <div className={$.join(className, Styles.layoutRowSpaceAround)}>{children}</div>;
}
