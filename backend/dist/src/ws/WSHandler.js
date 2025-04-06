"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSHandler = void 0;
const ws_1 = require("ws");
const AppLogic_1 = require("../services/AppLogic");
const Dispatcher_1 = __importDefault(require("./Dispatcher"));
class WSHandler {
    constructor(connections) {
        this.connections = connections;
    }
    setupHandler(socket) {
        socket.on("message", (message) => {
            Dispatcher_1.default.dispatch(JSON.parse(message), socket);
        });
        socket.on("close", () => {
            this.connections.delete(socket);
            AppLogic_1.AppLogic.getInstance().handleAdminList();
        });
    }
    sendToAll(message, role) {
        this.connections.forEach((user, socket) => {
            if (!role || role === (user === null || user === void 0 ? void 0 : user.role)) {
                this.sendMessage(socket, message);
            }
        });
    }
    sendMessage(socket, message) {
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }
    login(socket, user) {
        if (socket.readyState === ws_1.WebSocket.OPEN) {
            this.connections.set(socket, user);
        }
    }
    getUser(socket) {
        return this.connections.get(socket);
    }
    getUsers(role) {
        return [...this.connections.values()]
            .filter(c => c !== undefined)
            .filter(c => !role || role === (c === null || c === void 0 ? void 0 : c.role));
    }
}
exports.WSHandler = WSHandler;
