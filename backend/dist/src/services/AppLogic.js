"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogic = void 0;
const tickets_mockdata_1 = require("../mockdata/tickets_mockdata");
const users_mockdata_1 = require("../mockdata/users_mockdata");
class AppLogic {
    constructor(wsHandler) {
        this.wsHandler = wsHandler;
    }
    static getInstance(newWsHandler) {
        if (!AppLogic.instance && newWsHandler) {
            AppLogic.instance = new AppLogic(newWsHandler);
        }
        return AppLogic.instance;
    }
    handleLogin(user, socket) {
        const newUser = users_mockdata_1.mockUsers.find(u => {
            if (u.email === user.email) {
                if (user.password === u.password) {
                    return u;
                }
            }
        });
        if (newUser) {
            console.log("User found!", newUser);
            this.wsHandler.login(socket, newUser);
            this.wsHandler.sendMessage(socket, {
                type: "LOGIN",
                payload: newUser
            });
            this.handleTicketList(socket);
            this.handleAdminList();
        }
        else {
            console.log("Error while login");
        }
    }
    handleLogout(socket) {
        this.wsHandler.login(socket, undefined);
        this.handleAdminList();
    }
    handleAdminList() {
        this.wsHandler.sendToAll({ type: "ADMIN_LIST", payload: this.wsHandler.getUsers("USER") }, "ADMIN");
    }
    handleTicketList(socket) {
        const user = this.wsHandler.getUser(socket);
        let payload;
        if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN") {
            payload = tickets_mockdata_1.mockdata_tickets;
        }
        else {
            payload = tickets_mockdata_1.mockdata_tickets.filter(t => t.createdUserMail === (user === null || user === void 0 ? void 0 : user.email));
        }
        console.log("Payload" + payload);
        this.wsHandler.sendMessage(socket, { type: "TICKET_LIST", payload: payload });
    }
}
exports.AppLogic = AppLogic;
