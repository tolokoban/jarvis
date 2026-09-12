import { State } from "@/state";
import { isString } from "@tolokoban/type-guards";

export type Role = "god" | "admin";

export interface IfRoleProps {
  role: string | string[];
  children: React.ReactNode;
}

export function IfRole({ role, children }: IfRoleProps) {
  const roles = State.user.roles.useValue();

  return matchRole(role, roles) && children;
}

function matchRole(condition: IfRoleProps["role"], roles: string[]) {
  if (isString(condition)) {
    return roles.includes(condition);
  }

  for (const role of condition) {
    if (roles.includes(role)) return true;
  }

  return false;
}
