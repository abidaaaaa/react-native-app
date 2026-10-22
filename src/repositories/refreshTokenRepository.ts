// src/repositories/refreshTokenRepository.ts
import { randomUUID } from "node:crypto";

export interface RefreshTokenRecord {
  token: string;
  userId: number;
  userKind: "user" | "student";
  expiresAt: number;
}

export class RefreshTokenRepository {
  private tokens: Map<string, RefreshTokenRecord> = new Map();

  create(userId: number, userKind: "user" | "student", expiresInSeconds: number): RefreshTokenRecord {
    const token = randomUUID();
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const record: RefreshTokenRecord = { token, userId, userKind, expiresAt };
    this.tokens.set(token, record);
    return record;
  }

  isValid(token: string): { valid: boolean; userId?: number; userKind?: "user" | "student" } {
    const record = this.tokens.get(token);
    if (!record || Date.now() > record.expiresAt) {
      if (record) this.tokens.delete(token); // Limpiar si expiró
      return { valid: false };
    }
    return { valid: true, userId: record.userId, userKind: record.userKind };
  }

  delete(token: string): void {
    this.tokens.delete(token);
  }
}