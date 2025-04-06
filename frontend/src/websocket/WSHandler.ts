import {useTicketStore} from "@/store/TicketStore.ts";
import Dispatcher from "@/websocket/Dispatcher.ts";
import {IMessage} from "@/models/IMessage.ts";

class WSHandler {
    private socket: WebSocket | undefined = undefined;

    constructor() {
        this.handleConnection();
    }

    handleConnection() {
        this.socket = new WebSocket("ws://localhost:8765");

        this.socket.onopen = () => {
            useTicketStore.getState().setIsConnected(true);
        };

        this.socket.onclose = () => {
            useTicketStore.getState().setIsConnected(false);
        };

        this.socket.onmessage = (event) => {
            Dispatcher.dispatch(JSON.parse(event.data));
        };
    }

    /*handleConnection() {
        this.socket = new WebSocket("ws://localhost:8765");

        this.socket.onopen = () => {
            useAppStore.getState().setIsConnected(true);
        }

        this.socket.onclose = () => {
            useAppStore.getState().setIsConnected(false);
        }

        this.socket.onmessage = (event) => {
            Dispatcher.dispatch(JSON.parse(event.data));
        }
    }*/


    /*sendMessage(message: IMessage) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    }*/

    sendMessage(message: IMessage): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    }
}

export default new WSHandler();