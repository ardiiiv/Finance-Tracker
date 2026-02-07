import { prisma } from "@/lib/prisma";
import { generateToken, generateRefreshToken } from "@/utils/token";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // cek email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email atau Password salah" },
        { status: 401 },
      );
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Email atau Password salah" },
        { status: 401 },
      );
    }

    // buat token
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // mencegah refresh token menumpuk
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    // buat data baru
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // set cookie
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
