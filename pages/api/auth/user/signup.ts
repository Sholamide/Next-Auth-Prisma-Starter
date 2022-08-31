import { NextApiRequest, NextApiResponse } from "next";
import { ReadableStreamBYOBRequest } from "stream/web";
import { hashPassword } from "../../../../lib/bcrypt";
import { prisma } from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let isCurrentUser;
  if (req.method === "POST") {
    isCurrentUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    try {
      if (isCurrentUser) {
        return res.status(401).json("User already exists");
      }
      const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: await hashPassword(req.body.password),
          role: req.body.role,
        },
        select: {
          id: true,
          name: true,
          password: true,
          email: true,
          role: true,
        },
      });

      return res.status(200).json({
        message: "user created.",
        data: newUser,
      });
    } catch (error: any) {
      console.error("[api] auth/user/signup", error);
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}
