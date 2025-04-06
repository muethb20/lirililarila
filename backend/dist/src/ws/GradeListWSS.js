"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeListWSS = void 0;
const ws_1 = require("ws");
const WSHandler_1 = require("./WSHandler");
const AppLogic_1 = require("../services/AppLogic");
class GradeListWSS {
    constructor(port) {
        this.port = port;
        this.connections = new Map();
        this.wss = new ws_1.WebSocketServer({ port: port || 8765 });
        this.wsHandler = new WSHandler_1.WSHandler(this.connections);
        this.appLogic = AppLogic_1.AppLogic.getInstance(this.wsHandler);
        this.setupConnection();
    }
    setupConnection() {
        this.wss.on('connection', (ws) => {
            this.connections.set(ws, undefined);
            this.wsHandler.setupHandler(ws);
        });
    }
}
exports.GradeListWSS = GradeListWSS;
