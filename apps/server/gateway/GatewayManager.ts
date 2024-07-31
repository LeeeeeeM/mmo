import { RpcFunc, getProtoPathByRpcFunc } from "@mmo/common";
import { AuthClient, CheckTokenReq } from "@mmo/common/idl";
import * as grpc from "@grpc/grpc-js";
import WebSocket, { WebSocketServer } from "ws";

import { Singleton } from "@mmo/common/common/base";
// @ts-ignore
import root from "@mmo/common/idl/auto-gen-ws";

export class GatewayManager extends Singleton {
  static get Instance() {
    return super.GetInstance<GatewayManager>();
  }

  init() {
    const wss = new WebSocketServer({ port: 4000 });

    wss.on("connection", (ws) => {
      ws.on("error", console.error);

      ws.on("message", (data: Buffer) => {
        this.handleMessage(ws, data);
      });
    });

    console.log("gateway 服务启动");
  }

  async handleMessage(ws: WebSocket, buffer: Buffer) {
    // console.log(buffer.toString());
    // const { name, data } = JSON.parse(buffer.toString());

    const name = buffer.readUint8(0);
    const path = getProtoPathByRpcFunc(name, "req");
    const coder = root.lookupType(path);
    const data = coder.decode(buffer.slice(1));
    if (name === RpcFunc.enterGame) {
      const result = await this.checkToken(data as any);
      this.sendMessage(ws, name, result);
      // todo
    } else {
      // todo 跟 game服务做通信
    }
  }

  sendMessage(ws: WebSocket, name: RpcFunc, data: any) {
    const headerBuffer = Buffer.alloc(1);
    headerBuffer.writeUint8(name);
    const path = getProtoPathByRpcFunc(name, "res");
    const coder = root.lookupType(path);
    const dataBuffer = coder.encode(data).finish();
    const buffer = Buffer.concat([headerBuffer, dataBuffer]);
    ws.send(buffer);
  }

  checkToken({ token }: { token: string }) {
    return new Promise((res) => {
      const client = new AuthClient(
        "localhost:3333",
        grpc.credentials.createInsecure()
      );
      const req = new CheckTokenReq();
      req.setToken(token);
      client.checkToken(req, (err, message) => {
        res(message.toObject());
      });
    });
  }
}
