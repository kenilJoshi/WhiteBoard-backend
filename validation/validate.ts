import { ValidateData, ValidationResult} from "../type/Type";
import * as z from "zod";
import * as crypto from "crypto";
import ApiError from "../error/error";

export const validatePassword = async (data: ValidateData):Promise<ValidationResult> => {
  const registerValidateSchema = z
    .object({
      password: z.string().min(5),
    })
    .superRefine(({ password }, checkPassComplexity) => {
      const containsSpecialChar = (ch: string): boolean => {
        return /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
      };

      let countOfNumber = 0;
      let countOfSpecialChar = 0;

      for (let i = 0; i < password.length; i++) {
        const ch = password.charAt(i);
        if (!isNaN(+ch)) countOfNumber++;
        if (containsSpecialChar(ch)) countOfSpecialChar++;
      }

      if (countOfSpecialChar < 1) {
        checkPassComplexity.addIssue({
          code: "custom",
          message: "Password should contain special character",
        });
      }
      if (countOfNumber < 1) {
        checkPassComplexity.addIssue({
          code: "custom",
          message: "Password should contain at least one number",
        });
      }
    });

  try {
    // Validate data using Zod schema
    const validateMessage = registerValidateSchema.safeParse({
      password: data?.password,
    });

    // If validation passes
    if (validateMessage.success) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(data?.password, salt, 1000, 64, "sha512")
        .toString("hex");

      console.log(hashedPassword);
      return {
        password: hashedPassword,
        salt: salt,
      };
    } else {
      // If validation fails, throw an error with validation messages
      throw new ApiError(JSON.stringify(validateMessage.error.errors), 400, "VALIDATION_ERROR");
    }
  } catch (e) {
    // Handle the error and rethrow with the message
    if (e instanceof ApiError) {
      const errors = JSON.parse(e.message);
      console.log("-----------------", errors[0]);
      throw new ApiError(errors[0].message, 400, "VALIDATION_ERROR");
    }
    throw e;
  }
};

export const validatePasswordHash = (password_hash: string, salt: string, password: string) => {
  console.log(salt);
  
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
    console.log(password_hash === hash);
    
return password_hash === hash;
};
