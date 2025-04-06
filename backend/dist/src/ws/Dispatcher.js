"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogic_1 = require("../services/AppLogic");
class Dispatcher {
    static dispatch(msg, socket) {
        switch (msg.type) {
            case "LOGIN":
                AppLogic_1.AppLogic.getInstance().handleLogin(msg.payload, socket);
                break;
            case "LOGOUT":
                AppLogic_1.AppLogic.getInstance().handleLogout(socket);
                break;
            default:
                console.log(`Type ${msg.type} invalid`);
                break;
        }
    }
}
exports.default = Dispatcher;
