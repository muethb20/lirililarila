export type TRole = "ADMIN" | "USER";

export interface IUser {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: TRole
}