import bcrypt from "bcryptjs";

export async function authenticateUser(credentials) {
  const username = process.env.AUTH_USERNAME;
  const passwordHash = process.env.AUTH_PASSWORD_HASH?.replace(/\\/g, "");

  if (!credentials.username || !credentials.password) {
    throw new Error("Username dan password wajib diisi.");
  }

  if (credentials.username !== username) {
    throw new Error("Akun tidak ditemukan");
  }

  const isValid = await bcrypt.compare(credentials.password, passwordHash);
  if (!isValid) {
    throw new Error("Username atau password salah.");
  }

  return { id: "1", name: username };
}
