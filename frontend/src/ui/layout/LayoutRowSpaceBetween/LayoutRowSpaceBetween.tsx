import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./LayoutRowSpaceBetween.module.css"

const $ = Theme.classNames

export interface LayoutRowSpaceBetweenProps {
    className?: string
    children: React.ReactNode
}

export function LayoutRowSpaceBetween({ className, children }: LayoutRowSpaceBetweenProps) {
    return <div className={$.join(className, Styles.layoutRowSpaceBetween)}>
        {children}
    </div >
}