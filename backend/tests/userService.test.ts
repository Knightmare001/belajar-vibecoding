import { describe, it, expect, mock } from "bun:test";
import { UserService } from "../src/services/users/userService";
import { InvariantError } from "../src/exceptions/clientError";

describe("UserService Integration Logic Tests", () => {
  it("should throw error if email already exists", async () => {
    const mockRepo: any = {
      findByEmail: mock(async (email: string) => ({
        id: 1,
        email: "admin@gmail.com",
        name: "Admin",
        passwordHash: "xxx",
        roleId: 1,
        departmentId: null,
        nip: null,
        jabatan: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })),
      findRoleById: mock(async () => null),
      insertUser: mock(async () => null),
    };

    const service = new UserService(mockRepo);

    expect(
      service.createUser({
        email: "admin@gmail.com",
        password: "password123",
      })
    ).rejects.toThrow("email already exists");
  });

  it("should successfully hash password and return created user contract", async () => {
    let insertedData: any = null;

    const mockRepo: any = {
      findByEmail: mock(async () => null),
      findRoleById: mock(async (id: number) => ({ id, name: "guru_staf", description: "", createdAt: new Date() })),
      insertUser: mock(async (data: any) => {
        insertedData = data;
        return {
          id: 2,
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          roleId: data.roleId,
          departmentId: data.departmentId,
          nip: data.nip,
          jabatan: data.jabatan,
          createdAt: new Date("2026-11-08T10:00:00Z"),
          updatedAt: new Date("2026-11-08T10:00:00Z"),
          deletedAt: null,
        };
      }),
    };

    const service = new UserService(mockRepo);

    const result = await service.createUser({
      name: "Budi Santoso",
      email: "budi@sekolah.sch.id",
      password: "Password123!",
      roleId: 2,
    });

    // Check response structure
    expect(result.id).toBe(2);
    expect(result.email).toBe("budi@sekolah.sch.id");
    expect(result.created_at).toBeDefined();
    expect(result.updated_at).toBeDefined();

    // Verify password was hashed (not plain text)
    expect(insertedData.passwordHash).not.toBe("Password123!");
    expect(insertedData.passwordHash.startsWith("$2b$") || insertedData.passwordHash.startsWith("$2a$")).toBe(true);
  });
});

