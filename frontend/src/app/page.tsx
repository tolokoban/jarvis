import React from "react"
import { useLocalStorageState, ViewInputMultiText, ViewInputText } from "@tolokoban/ui"

import { Md } from "@/components/Md"
import { API } from "@/service"
import LayoutCenter from "@/ui/layout/LayoutCenter"

import Styles from "./page.module.css"

export default function Page() {
    console.log('🐞 [page@11] Styles =', Styles) // @FIXME: Remove this line written on 2026-09-12 at 14:28
    const [content, setContent] = useLocalStorageState("Comment connaitre l'espace disque sur un Linux Mint par ligne de commande ?", "content")
    const [response, setResponse] = React.useState("")
    const handleSendPrompt = async()=>{
        setResponse("Let me think...")
        setResponse(await API.chat(content))
    }

    return <LayoutCenter>
        <ViewInputText fullwidth label="Prompt"value={content} onChange={setContent} onEnterKeyPressed={handleSendPrompt}/>
        <hr/>
        <div className={Styles.response}><Md value={response}/></div>
    </LayoutCenter>
}
