import {WebSocket, WebSocketServer} from "ws";
import {WSHandler} from "./WSHandler";
import {IUser} from "../models/IUser";
import {AppLogic} from "../services/AppLogic";

export class GradeListWSS {
    private readonly wss: WebSocketServer;
    private readonly wsHandler: WSHandler;
    private readonly connections: Map<WebSocket, IUser | undefined> = new Map();
    private readonly appLogic: AppLogic;


    constructor(readonly port?: number) {
        this.wss = new WebSocketServer({port: port || 8765});
        this.wsHandler = new WSHandler(this.connections);
        this.appLogic = AppLogic.getInstance(this.wsHandler);
        this.setupConnection();
    }

    private setupConnection() {
        this.wss.on('connection', (ws) => {
            this.connections.set(ws, undefined);
            this.wsHandler.setupHandler(ws);
        })
    }
}