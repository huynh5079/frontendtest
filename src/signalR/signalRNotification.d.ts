import * as signalR from "@microsoft/signalr";
declare const connection: signalR.HubConnection;
export declare const startConnection: () => Promise<void>;
export default connection;
