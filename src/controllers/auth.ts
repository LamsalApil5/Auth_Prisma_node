import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { signupSchema } from "../schema/users";
// SignUp Handler
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    signupSchema.parse(req.body)
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      return next(
        new BadRequestsException(
          "User not found!",
          ErrorCodes.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
};

// Login Handler
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    return next(
      new BadRequestsException(
        "User does not exists!",
        ErrorCodes.USER_NOT_FOUND
      )
    );
  }

  if (!compareSync(password, user.password)) res.json(user);
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};
