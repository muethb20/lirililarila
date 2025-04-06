import {IUser} from "../models/IUser";

export const mockUsers: IUser[] = [
    {
        firstname: "Max",
        lastname: "Mustermann",
        email: "max.mustermann@example.com",
        password: "passwort123",
        role: "ADMIN"
    },
    {
        firstname: "Erika",
        lastname: "Musterfrau",
        email: "erika.musterfrau@example.com",
        password: "geheim123",
        role: "USER"
    },
    {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: "test1234",
        role: "USER"
    }
];

