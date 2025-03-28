import { NextResponse } from "next/server";

export function createResponse(success: boolean, message: string, status: number, data?: object) {
  return NextResponse.json({ success, message, ...data }, { status });
}

export function handleErrorResponse(error: unknown, defaultMessage: string) {
  return {
    success: false,
    message: error instanceof Error ? error.message : defaultMessage,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  };
}