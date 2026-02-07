import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      // Hapus refresh token dari database
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Hapus cookie
    cookieStore.delete("refreshToken");

    return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
