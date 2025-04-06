import {ITicket} from "./ITicket";
import {IUser} from "./IUser";

export type TType = "LOGIN" | "LOGOUT" | "ADMIN_LIST" | "TICKET_LIST";
export type TPayload = ITicket[] | IUser | string | IUser[];

export interface IMessage {
    type: TType;
    payload?: TPayload;
}