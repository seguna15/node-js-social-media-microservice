import { CustomError } from "@/utils/CustomError";

export class NotAllowedError extends CustomError {
  statusCode = 405;
  name = "NotAllowedError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotAllowedError.prototype);
  }

  serialize(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
