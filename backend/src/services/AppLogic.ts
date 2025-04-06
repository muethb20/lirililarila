import {WSHandler} from "../ws/WSHandler";
import {IUser} from "../models/IUser";
import {WebSocket} from "ws";
import {mockdata_tickets} from "../mockdata/tickets_mockdata";
import {mockUsers} from "../mockdata/users_mockdata";

export class AppLogic {
    private static instance: AppLogic;

    private constructor(private wsHandler: WSHandler) {
    }

    public static getInstance(newWsHandler?: WSHandler) {
        if (!AppLogic.instance && newWsHandler) {
            AppLogic.instance = new AppLogic(newWsHandler);
        }
        return AppLogic.instance;
    }

    handleLogin(user: IUser, socket: WebSocket) {
        const newUser = mockUsers.find(u => {
            if (u.email === user.email) {
                if (user.password === u.password) {
                    return u;
                }
            }
        })

        if (newUser) {

            console.log("User found!", newUser);
            this.wsHandler.login(socket, newUser);

            this.wsHandler.sendMessage(socket, {
                type: "LOGIN",
                payload: newUser
            });

            this.handleTicketList(socket);
            this.handleAdminList()
        } else {
            console.log("Error while login");
        }
    }

    handleLogout(socket: WebSocket) {
        this.wsHandler.login(socket, undefined);
        this.handleAdminList();
    }


    handleAdminList() {
        this.wsHandler.sendToAll({type: "ADMIN_LIST", payload: this.wsHandler.getUsers("USER")}, "ADMIN");
    }

    handleTicketList(socket: WebSocket) {
        const user = this.wsHandler.getUser(socket);

        let payload;

        if (user?.role === "ADMIN") {
            payload = mockdata_tickets;
        } else {
            payload = mockdata_tickets.filter(t => t.createdUserMail === user?.email);
        }

        console.log("Payload" + payload);
        this.wsHandler.sendMessage(socket, {type: "TICKET_LIST", payload: payload});
    }
}