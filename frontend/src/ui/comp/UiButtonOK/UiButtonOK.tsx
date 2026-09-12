import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./UiButtonOK.module.css"
import { UiButton } from "../UiButton"

const $ = Theme.classNames

export interface UiButtonOKProps {
    className?: string
    onClick(): void
}

export function UiButtonOK({ className, onClick }: UiButtonOKProps) {
    return <UiButton className={$.join(className, Styles.uiButtonOK)} onClick={onClick} color="primary-5">
        Valider
    </UiButton >
}