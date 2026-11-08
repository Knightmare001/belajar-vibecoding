import bcrypt from "bcrypt";
import { userRepository, type UserRepository } from "./userRepository";
import { InvariantError } from "../../exceptions/clientError";
import type { CreateUserPayload } from "./validator/schema";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async createUser(payload: CreateUserPayload) {
    const email = payload.email.trim().toLowerCase();

    // 1. Cek duplikasi email
    const existingUser = await this.repo.findByEmail(email);
    if (existingUser) {
      throw new InvariantError("email already exists", 400);
    }

    // 2. Validate role
    let roleId = payload.roleId;
    if (!roleId) {
      // Default to guru_staf if not provided
      const defaultRole = await this.repo.findRoleByName("guru_staf");
      if (!defaultRole) {
        throw new InvariantError("Default role not found in system", 500);
      }
      roleId = defaultRole.id;
    } else {
      const roleExists = await this.repo.findRoleById(roleId);
      if (!roleExists) {
        throw new InvariantError("Role does not exist", 400);
      }
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(payload.password, saltRounds);

    // 4. Default name if not given
    const name: string =
      payload.name && payload.name.trim() !== "" ? payload.name.trim() : email.split("@")[0] || "User";

    // 5. Insert to DB
    const newUser = await this.repo.insertUser({
      name,
      email,
      passwordHash,
      roleId,
      departmentId: payload.departmentId,
      nip: payload.nip,
      jabatan: payload.jabatan,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      created_at: newUser.createdAt,
      updated_at: newUser.updatedAt,
    };
  }
}

export const userService = new UserService();
