import { db } from "./index.ts";
import { files } from "./schema.ts";
import { eq, and } from "drizzle-orm";

export interface FileRecord {
  id: string;
  ownerUserId: string;
  key: string;
  filename: string;
  mime: string;
  size: number;
  createdAt: Date | null;
}

export async function createFileRecord(data: {
  id: string;
  ownerUserId: string;
  key: string;
  filename: string;
  mime: string;
  size: number;
}): Promise<FileRecord> {
  const [row] = await db.insert(files).values(data).returning();
  return row;
}

export async function listFilesForOwner(ownerUserId: string): Promise<FileRecord[]> {
  return db.select().from(files).where(eq(files.ownerUserId, ownerUserId));
}

// TEN-03: never distinguish "exists but not yours" from "does not exist" — the
// caller returns 404 either way.
export async function getOwnedFile(id: string, ownerUserId: string): Promise<FileRecord | null> {
  const [row] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, id), eq(files.ownerUserId, ownerUserId)));
  return row ?? null;
}

export async function deleteOwnedFile(id: string, ownerUserId: string): Promise<boolean> {
  const result = await db
    .delete(files)
    .where(and(eq(files.id, id), eq(files.ownerUserId, ownerUserId)))
    .returning({ id: files.id });
  return result.length > 0;
}
