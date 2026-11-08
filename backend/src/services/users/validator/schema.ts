import { InvariantError } from "../../../exceptions/clientError";

export interface CreateUserPayload {
  name?: string;
  email: string;
  password: string;
  roleId?: number;
  departmentId?: number;
  nip?: string;
  jabatan?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserPayload(payload: any): asserts payload is CreateUserPayload {
  // 1. Validate request body exists
  if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
    throw new InvariantError("Request body cannot be empty");
  }

  const { email, password, roleId, name } = payload;

  // 2. Validate email
  if (!email || typeof email !== "string" || email.trim() === "") {
    throw new InvariantError("Email is required");
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    throw new InvariantError("Validation error: Invalid email format");
  }

  // 3. Validate password
  if (!password || typeof password !== "string") {
    throw new InvariantError("Password is required");
  }

  if (password.length < 8) {
    throw new InvariantError("Password must be at least 8 characters long");
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    throw new InvariantError("Password must contain both letters and numbers");
  }

  // 4. Validate role
  if (roleId !== undefined) {
    if (typeof roleId !== "number" || isNaN(roleId) || roleId <= 0) {
      throw new InvariantError("RoleId must be a valid positive number");
    }
  }

  // 5. Validate name if provided
  if (name !== undefined && typeof name !== "string") {
    throw new InvariantError("Name must be a string");
  }
}

