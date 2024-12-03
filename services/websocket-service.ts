import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";

class WebSocketService extends EventEmitter {
  private socket: Socket | null = null;
  private webSocketId: string = "";

  constructor() {
    super();
    this.connect();
  }

  public connect() {
    if (!this.socket) {
      const websocketUrl = process.env.NEXT_PUBLIC_API_URL || "";
      this.socket = io(websocketUrl, {
        path: "/ws/sockets",
        transports: ["websocket"],
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 2000000,
      });

      this.socket.on("connect", () => {
        if (this.socket?.recovered) {
          console.log("Recovered session");
          // recovered session
          this.webSocketId = this.socket?.id || "";
          this.emit("statusChange", true);
        } else {
          this.webSocketId = this.socket?.id || "";
          this.emit("statusChange", true);
        }
      });

      this.socket.on("disconnect", () => {
        this.emit("statusChange", false);
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Reconnect attempt #${attemptNumber}`);
      });

      this.socket.on("reconnect", () => {
        console.log("Reconnected to WebSocket");
        this.webSocketId = this.socket?.id || "";
        this.emit("statusChange", true);
      });

      this.socket.on("reconnect_failed", () => {
        console.log("Failed to reconnect to WebSocket");
        this.emit("statusChange", false);
      });

      // Add other event listeners as needed
    } else if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket() {
    return this.socket;
  }

  public getWebSocketId() {
    return this.webSocketId;
  }

  public isConnected() {
    return this.socket?.connected || false;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
