import React from "react";
import { Theme } from "@tolokoban/ui";

import Styles from "./LayoutPage.module.css";

const $ = Theme.classNames;

export interface LayoutPageProps {
  className?: string;
  children: React.ReactNode;
}

export function LayoutPage({ className, children }: LayoutPageProps) {
  return <div className={$.join(className, Styles.layoutPage)}>{children}</div>;
}
