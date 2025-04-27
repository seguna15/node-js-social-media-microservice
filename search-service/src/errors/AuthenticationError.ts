import { CustomError } from "@/utils/CustomError";

export class AuthenticationError extends CustomError {
  statusCode = 401;
  name = "AuthenticationError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serialize(): { success: boolean, message: string } {
    return {success: false, message: this.message };
  }
}
