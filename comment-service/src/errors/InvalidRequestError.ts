import { CustomError } from "@/utils/CustomError";

export class InvalidRequestError extends CustomError {
  statusCode = 422;
  name = "InvalidRequestError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }

  serialize(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
