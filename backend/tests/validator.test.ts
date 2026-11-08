import { describe, it, expect } from "bun:test";
import { validateUserPayload } from "../src/services/users/validator/schema";
import { InvariantError } from "../src/exceptions/clientError";

describe("User Validator Tests", () => {
  it("should fail when body is empty", () => {
    expect(() => validateUserPayload({})).toThrow(InvariantError);
  });

  it("should fail on invalid email format", () => {
    expect(() =>
      validateUserPayload({
        email: "not-an-email",
        password: "password123",
      })
    ).toThrow("Validation error: Invalid email format");
  });

  it("should fail on short password", () => {
    expect(() =>
      validateUserPayload({
        email: "valid@gmail.com",
        password: "short",
      })
    ).toThrow("Password must be at least 8 characters long");
  });

  it("should fail on password without numbers", () => {
    expect(() =>
      validateUserPayload({
        email: "valid@gmail.com",
        password: "onlylettershere",
      })
    ).toThrow("Password must contain both letters and numbers");
  });

  it("should fail on invalid roleId", () => {
    expect(() =>
      validateUserPayload({
        email: "valid@gmail.com",
        password: "validPassword123",
        roleId: -1,
      })
    ).toThrow("RoleId must be a valid positive number");
  });

  it("should pass on valid payload", () => {
    expect(() =>
      validateUserPayload({
        email: "admin@gmail.com",
        password: "admin123",
        name: "Admin User",
        roleId: 1,
      })
    ).not.toThrow();
  });
});
