import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./LayoutColumn.module.css"

const $ = Theme.classNames

export interface LayoutColumnProps {
    className?: string
    children: React.ReactNode
}

export function LayoutColumn({ className, children }: LayoutColumnProps) {
    return <div className={$.join(className, Styles.layoutColumn)}>
        {children}
    </div >
}