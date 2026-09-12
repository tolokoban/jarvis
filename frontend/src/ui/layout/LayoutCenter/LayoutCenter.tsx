import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./LayoutCenter.module.css"

const $ = Theme.classNames

export interface LayoutCenterProps {
    className?: string
    children: React.ReactNode
}

export default function LayoutCenter({ className, children }: LayoutCenterProps) {
    return <div className={$.join(className, Styles.layoutCenter)}>
        {children}
    </div>
}