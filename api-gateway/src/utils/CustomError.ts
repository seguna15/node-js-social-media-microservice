export abstract class CustomError extends Error {
  constructor(public message: string) {
    super(message);
  }
  abstract statusCode: number;
  abstract name: string;

  abstract serialize(): { success: boolean; message: string };
}

