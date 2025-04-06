import {ITicket} from "@/models/Ticket.model.ts";
import {IUser} from "@/models/User.model.ts";
import {create} from "zustand/react";

interface ITicketStore {
    isConnected: boolean,
    tickets: ITicket[],
    setTickets: (tickets: ITicket[]) => void,
    user: IUser | undefined,
    admins: IUser[],
    setIsConnected: (isConnected: boolean) => void,
    setUser: (user: IUser | undefined) => void,
    setAdmins: (admins: IUser[]) => void
}

export const useTicketStore = create<ITicketStore>(
    (set) => ({
        tickets: [],
        setTickets: (tickets: ITicket[]) => {set({tickets})},
        user: undefined,
        setUser: (user) => {set({user})},
        admins: [],
        setAdmins: (admins) => {set({admins})},
        isConnected: false,
        setIsConnected: (isConnected) => {set({isConnected})},
    }));