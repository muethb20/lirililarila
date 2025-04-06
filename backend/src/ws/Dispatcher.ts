import {IMessage} from "../models/IMessage";
import {AppLogic} from "../services/AppLogic";
import {WebSocket} from "ws";
import {IUser} from "../models/IUser";

class Dispatcher {
    static dispatch(msg: IMessage, socket: WebSocket) {
        switch (msg.type) {
            case "LOGIN":
                AppLogic.getInstance().handleLogin(msg.payload as IUser, socket);
                break;

            case "LOGOUT":
                AppLogic.getInstance().handleLogout(socket);
                break;

            default:
                console.log(`Type ${msg.type} invalid`);
                break;
        }
    }
}

export default Dispatcher;