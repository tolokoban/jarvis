import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Theme } from "@tolokoban/ui";

import Styles from "./Md.module.css";

const $ = Theme.classNames;

export interface MdProps {
  className?: string;
  value: string;
}

export function Md({ className, value }: MdProps) {
  return (
    <div className={$.join(className, Styles.md)}>
      <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
    </div>
  );
}
