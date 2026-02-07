import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/utils/token";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  // ambil refresh token dari cookie
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // cari refresh token
  const tokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenInDb) {
    cookieStore.delete("refreshToken");
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // cek expired
  if (tokenInDb.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: "Refresh token expired" },
      { status: 401 },
    );
  }

  // buat token baru
  const newAccessToken = generateToken(tokenInDb.user);

  return NextResponse.json({ token: newAccessToken });
}
