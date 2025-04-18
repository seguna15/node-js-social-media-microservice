import { CustomError } from "@/utils/CustomError";

export class ConflictError extends CustomError {

  statusCode = 409;
  name = "ConflictError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serialize(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
