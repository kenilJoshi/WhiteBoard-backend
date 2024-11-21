import ApiError from "../error/error";
import prisma from "../prisma/prisma-client";
import { ChangePassword, IUser, RegisteredUser } from "../type/Type";
import generateToken from "../validation/generateToken";
import { validatePasswordHash, validatePassword } from "../validation/validate";
import nodemailer, { Transporter } from "nodemailer";
import * as crypto from "crypto";

const transporter: Transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env["NODEMAILER_EMAIL"]}`,
    pass: `${process.env["NODEMAILER_PASSWORD"]}`,
  },
});



const checkUserUniqueness = async (email: string) => {
  // try{
  console.log(prisma);
  
  const findWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
    console.log(findWithEmail);

  if (findWithEmail !== null) {
    throw new ApiError("This Email is Already Taken", 400, "UNIQUE");
  } else {
    console.log("kenil");
    
    return true;
  }
};

const findUserWithEmail = async (email: string) => {
  const findWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      password: true,
      passwordSalt: true,
      email: true,
      name: true,
    },
  });

  if (findWithEmail === null) {
    throw new ApiError("The Email Doesnot Exist", 400, "NOT_FOUND_ERROR");
  } else {
    return findWithEmail;
  }
};

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env["NODEMAILER_EMAIL"],
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw error;
  }
};

export const createUser = async (data: IUser): Promise<RegisteredUser> => {
  //   try {
  console.log(data.name);
  
  const name = data.name?.trim();
  const email = data.email?.trim();
  const password = data.password.trim() || "";
  const passwordSalt = data.passwordSalt.trim() || "";

  const findValue = await checkUserUniqueness(email);
  console.log("=>>>", findValue);

  if (findValue == true) {
    // console.log("=>>>",findValue);
    console.log(prisma);
    
    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        passwordSalt,
      },
    });

    return {
      username: createUser.name,
      email: createUser.email,
      token: generateToken({
        id: createUser.id,
        email: createUser.email,
        name: createUser.name
      }),
    };
  } else {
    throw new ApiError("Something went Wrong", 400, "ERROR");
  }
};

export const login = async (data: Partial<IUser>) => {
  const email = data.email;
  const password = data.password;
  console.log(data);

  const getUserWithEmail = await findUserWithEmail(email || "");
  console.log(getUserWithEmail);

  if (getUserWithEmail) {
    const checkPassword = validatePasswordHash(
      getUserWithEmail.password,
      getUserWithEmail.passwordSalt,
      password || ""
    );
    if (checkPassword) {
      return {
        username: getUserWithEmail.name,
        email: getUserWithEmail.email,
        token: generateToken({
          id: getUserWithEmail.id,
          email: getUserWithEmail.email,
          name: getUserWithEmail.name
        }),
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const forgotPassword = async (data: Partial<IUser>) => {
  const email: string = data.email || "";

  const getUserWithEmail = await findUserWithEmail(email || "");

  if (getUserWithEmail) {
    let buffer = crypto.randomBytes(2);

    let otpGenerate = buffer.readUInt16BE(0) % 10000;
    let otp: string = otpGenerate.toString().padStart(4, "0");

    // console.log(otp);

    const updateUser = await prisma.user.update({
      where: {
        email: getUserWithEmail.email,
      },
      data: {
        forgotpasswordtoken: otp,
      },
    });

    await sendEmail(
      email,
      "Forgot Password",
      "Forgot Password",
      `<h1>Here is the Otp for Forgot Password ${otp}</h1>`
    );

    return updateUser;
  } else {
    return null;
  }
};

const findWithOtp = async (otp: string, email: string) => {
  
  const findUser12 = await prisma.user.findUnique({
    where: {
      forgotpasswordtoken: otp,
      email: email
    },
    select: {
      password: true,
      passwordSalt: true,
      email: true,
      name: true,
    },
  });
  console.log(findUser12);
  

  if (findUser12 == null) {
    throw new ApiError("Otp is Wrong", 400, "NOT_FOUND_ERROR");
  } else {
    return findUser12;
  }
};

export const changePassword = async (data: ChangePassword) => {
  const otp = data.otp;
  const email = data.email
  const newPassword = data.newPassword;
  const oldPassword = data.oldPassword;

  const findUserOtp = await findWithOtp(otp, email);
  // console.log(findUserOtp);
  
  if (findUserOtp !== null) {
    const checkPassword = validatePasswordHash(
      findUserOtp.password,
      findUserOtp.passwordSalt,
      oldPassword || ""
    );

    if (checkPassword) {
      const createSaltPassword = await validatePassword({
        password: newPassword,
      });
      console.log("==========>",findUserOtp);
      
      const updatePassword = await prisma.user.update({
        where: {
          email: findUserOtp.email,
        },
        data: {
          forgotpasswordtoken: "",
          password:  createSaltPassword.password,
          passwordSalt: createSaltPassword.salt
        },
      });

      return updatePassword

    } else {
      throw new ApiError("Password is Wrong", 400, "VALIDATION_ERROR")
    }
  }
};
