export enum HTTP_METHOD {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE",
}

export type Login = {
  readonly email: string;
  readonly password: string;
};

export type Register = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
};
