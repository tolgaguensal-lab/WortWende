import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withApiKey } from "@/lib/api";
import { errorResponse } from "@/lib/api/api-errors";

// DELETE /api/v1/admin/api-keys/[id] — Key deaktivieren
async function deleteKey(req: NextRequest, context: { apiKeyId: string; keyName: string; scopes: string }) {
  // ID aus der URL parsen
  const urlId = req.nextUrl.pathname.split("/").pop();
  if (!urlId) {
    return errorResponse(400, "VALIDATION_ERROR", "Key-ID fehlt");
  }

  const existing = await prisma.apiKey.findUnique({ where: { id: urlId } });
  if (!existing) {
    return errorResponse(404, "NOT_FOUND", "API-Key nicht gefunden");
  }

  // Key deaktivieren (nicht löschen — für Audit-Trail)
  await prisma.apiKey.update({
    where: { id: urlId },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true, message: "API-Key deaktiviert" });
}

export const DELETE = withApiKey(deleteKey, "admin");
