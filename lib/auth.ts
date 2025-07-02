import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}
