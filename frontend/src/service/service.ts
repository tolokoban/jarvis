import { State } from "@/state";

export async function api(entrypoint: string, input: unknown): Promise<unknown> {
  let resp = await post(entrypoint, input);
  if (resp.ok) return await resp.json();

  if (resp.status === 403) {
    resp = await post("login", {
      username: State.user.login,
      password: State.user.password,
    });
    if (!resp.ok) {
      throw new ApiError(resp.status, resp.statusText);
    }

    resp = await post(entrypoint, input);
    if (resp.ok) return await resp.json();
  }

  throw new ApiError(resp.status, resp.statusText);
}

async function post(entrypoint: string, input: unknown): Promise<Response> {
  return fetch(`api/${entrypoint}`, {
    method: "POST",
    // Includes session cookie
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    console.error(`ApiError (#${code}): ${message}`);
  }
}
