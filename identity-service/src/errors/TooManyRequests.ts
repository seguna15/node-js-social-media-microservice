import { CustomError } from "@/utils/CustomError";

export class TooManyRequests extends CustomError {
  statusCode = 403;
  name = "TooManyRequests";
  constructor(public message: string ) {
    super(message);
    Object.setPrototypeOf(this, TooManyRequests.prototype);
  }

  serialize(): { success: boolean, message: string } {
    return {success: false, message: this.message };
  }
}
