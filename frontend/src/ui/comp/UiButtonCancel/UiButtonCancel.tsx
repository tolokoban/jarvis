import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./UiButtonCancel.module.css"
import { UiButton } from "../UiButton"

const $ = Theme.classNames

export interface UiButtonCancelProps {
    className?: string
    onClick(): void
}

export function UiButtonCancel({ className, onClick }: UiButtonCancelProps) {
    return <UiButton className={$.join(className, Styles.uiButtonCancel)} onClick={onClick} color="primary-5">
        Annuler
    </UiButton >
}