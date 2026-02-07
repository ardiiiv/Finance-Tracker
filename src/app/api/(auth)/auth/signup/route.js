import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/token";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // cek email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // buat user baru
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    // buat token
    const accessToken = generateToken(user);

    return NextResponse.json(
      {
        message: "Register berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
