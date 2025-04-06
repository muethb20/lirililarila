import {ITicket} from "./Ticket.model.ts"
import {IUser} from "./User.model.ts";

export type TType = "LOGIN" | "LOGOUT" | "ADMIN_LIST" | "TICKET_LIST";
export type TPayload = ITicket[] | IUser | string | IUser[];

export interface IMessage {
    type: TType;
    payload?: TPayload;
}