import { NextResponse } from "next/server";

export type ErrorCode =
  | "INVALID_KEY"
  | "EXPIRED_KEY"
  | "INSUFFICIENT_SCOPE"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
}

export function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  headers?: Record<string, string>,
): NextResponse {
  const body: ApiErrorBody = { error: message, code };
  if (details) body.details = details;
  return NextResponse.json(body, { status, headers });
}

export function apiKeyError(code: ErrorCode, message: string): NextResponse {
  const status =
    code === "INSUFFICIENT_SCOPE"
      ? 403
      : code === "RATE_LIMITED"
        ? 429
        : code === "NOT_FOUND"
          ? 404
          : 401;
  return errorResponse(status, code, message);
}
