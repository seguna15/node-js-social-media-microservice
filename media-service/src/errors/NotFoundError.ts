import { CustomError } from "@/utils/CustomError";

export class NotFoundError extends CustomError {

  statusCode = 404;
  name = "NotFoundError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
