export type UserRole = "ADMIN" | "CUSTOMER";

/**
 * Checks if a given role is an ADMIN.
 */
export function isAdmin(role?: string | null): boolean {
  return role === "ADMIN";
}

/**
 * Enterprise permission check for administrative access.
 */
export function canAccessAdmin(role?: string | null): boolean {
  return role === "ADMIN";
}
