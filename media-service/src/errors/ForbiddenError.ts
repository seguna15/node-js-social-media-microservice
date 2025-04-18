import { CustomError } from "@/utils/CustomError";

export class ForbiddenError extends CustomError {
  statusCode = 403;
  name = "ForbiddenError";
  constructor(public message: string ) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serialize(): { success: boolean, message: string } {
    return {success: false, message: this.message };
  }
}
