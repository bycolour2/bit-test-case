import { createEffect } from "effector";

export interface Request {
  path: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: URLSearchParams | Record<string, any>;
  body?: { json: unknown };
  parseAs?: "auto" | "arrayBuffer";
}

export type RequestError =
  | { message: "unauthorized" }
  | { message: "notFound" }
  | { message: "unprocessableEntity" }
  | { message: "serverError" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestFx = createEffect<Request, any, RequestError>(
  async (params: Request) => {
    const url = new URL(
      `${import.meta.env.VITE_BACKEND_URL}${params.path}`,
      document.location.toString(),
    );
    url.search =
      params.query instanceof URLSearchParams
        ? params.query.toString()
        : new URLSearchParams(params.query).toString();

    const body = params.body?.json
      ? JSON.stringify(params.body.json)
      : undefined;
    const headers = new Headers();

    if (params.body?.json) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      method: params.method,
      body,
      // credentials: "include",
      headers,
    });

    const parseAs = params.parseAs ?? "auto";
    const isJson = response.headers
      .get("Content-Type")
      ?.includes("application/json");

    if (response.ok) {
      if (isJson && parseAs === "auto") {
        return response.json();
      }
      if (parseAs === "arrayBuffer") {
        return response.arrayBuffer();
      }
      return response.text();
    }

    if (isJson) {
      throw await response.json();
    }

    if (response.status === 401) {
      throw { message: "unauthorized" };
    }
    if (response.status === 404) {
      throw { message: "notFound" };
    }
    if (response.status === 422) {
      throw { message: "unprocessableEntity" };
    }
    if (response.status === 500) {
      throw { message: "serverError" };
    }

    throw await response.text();
  },
);

requestFx.fail.watch(({ params, error }) => {
  console.error("requestFx.fail", params, error);
});
