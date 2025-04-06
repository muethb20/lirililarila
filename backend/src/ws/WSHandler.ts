import {WebSocket} from "ws";
import {IUser, TRole} from "../models/IUser";
import {AppLogic} from "../services/AppLogic";
import Dispatcher from "./Dispatcher";
import {IMessage} from "../models/IMessage";

export class WSHandler {
    private readonly connections: Map<WebSocket, IUser | undefined>;

    constructor(connections: Map<WebSocket, IUser | undefined>) {
        this.connections = connections;
    }

    setupHandler(socket: WebSocket) {
        socket.on("message", (message: string) => {
            Dispatcher.dispatch(JSON.parse(message), socket);
        })
        socket.on("close", () => {
            this.connections.delete(socket);
            AppLogic.getInstance().handleAdminList();
        })
    }

    sendToAll(message: IMessage, role?: TRole) {
        this.connections.forEach((user, socket) => {
            if (!role || role === user?.role) {
                this.sendMessage(socket, message);
            }
        })
    }

    sendMessage(socket: WebSocket, message: IMessage) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }

    login(socket: WebSocket, user: IUser | undefined) {
        if (socket.readyState === WebSocket.OPEN) {
            this.connections.set(socket, user);
        }
    }

    getUser(socket: WebSocket) {
        return this.connections.get(socket);
    }

    getUsers(role?: TRole) {
        return [...this.connections.values()]
            .filter(c => c !== undefined)
            .filter(c => !role || role === c?.role) as IUser[];
    }
}