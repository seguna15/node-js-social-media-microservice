import { CustomError } from "@/utils/CustomError";

export class DatabaseError extends CustomError {
  statusCode = 500
  name = "DatabaseError";
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serialize(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }


}