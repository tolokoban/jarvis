import { assertType, isType } from "@tolokoban/type-guards";
import { api } from "./service";

export const API = {
  async chat(content: string): Promise<string> {
    try {
      const data = await api("chat", { content});
      assertType(data, {response: "string"})
      return data.response;
    } catch (error) {
      console.error('Error in API "login":', error);
      return "An error occured! " + (error instanceof Error ? error.message : JSON.stringify(error));
    }
  },
};
