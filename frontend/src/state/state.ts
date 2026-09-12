import AtomicState from "@tolokoban/react-state";
import { isString } from "@tolokoban/type-guards";

export const State = {
  language: new AtomicState(navigator.language, {
    storage: {
      id: "language",
      guard: isString,
    },
    transform(value: string) {
      const lang = value.trim().substring(0, 2).toLocaleLowerCase();
      return ["en", "fr", "it"].includes(lang) ? lang : "en";
    },
  }),
  user: {
    login: new AtomicState("", {
      storage: {
        guard: isString,
        id: "State/user/login",
      },
    }),
    password: new AtomicState(""),
    nickname: new AtomicState<string | null>(null),
    roles: new AtomicState<string[]>([]),
  },
};
