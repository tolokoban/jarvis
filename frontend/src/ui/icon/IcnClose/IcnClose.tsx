import { IconClose } from "@tolokoban/ui";

export interface IcnCloseProps {
  className?: string;
  onClick?(): void;
}

export function IcnClose({ className, onClick }: IcnCloseProps) {
  return <IconClose className={className} onClick={onClick} />;
}
