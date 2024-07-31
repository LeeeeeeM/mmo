import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
import { createHash } from "crypto";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import Crypt from "node-jsencrypt";
import * as grpc from "@grpc/grpc-js";

import {
  AuthService,
  CheckTokenRes,
  CheckTokenResData,
  PrivateKey,
} from "@mmo/common";
import { queryPromise } from "../utils/query";

const cache = new Map();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "mmodb",
});

connection.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const crypt = new Crypt();
crypt.setKey(PrivateKey);

app.get("/", function (req, res) {
  res.send("hello world");
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);

    let { account, password } = req.body;

    account = crypt.decrypt(account);
    password = crypt.decrypt(password);

    const hash = createHash("md5");
    hash.update(password);
    const passwordHash = hash.digest("hex");

    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // 检查账户是否存在
    const checkAccount = await queryPromise(
      connection,
      `SELECT * FROM user WHERE account = ?`,
      [account]
    );

    if (checkAccount.length > 0) {
      return res.status(400).json({ error: "Account already exists" });
    }

    // 插入新用户
    const createUser = await queryPromise(
      connection,
      `INSERT INTO user (account, password, created_time) VALUES (?, ?, ?)`,
      [account, passwordHash, time]
    );

    console.log(createUser); // 根据需要记录或处理插入结果
    return res.json({ info: "Created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }

});

app.post("/login", async (req, res) => {
  try {
    let { account, password } = req.body;
    account = crypt.decrypt(account); // 假设解密函数存在
    password = crypt.decrypt(password);
    const passwordHash = createHash("md5").update(password).digest("hex");

    const results = await queryPromise(
      connection,
      `SELECT * FROM user WHERE account = ? AND password = ?`,
      [account, passwordHash]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = uuidv4();
    // 假设 cache.set 接受token和account并返回Promise
    await cache.set(token, account);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("auth 服务启动");
});

const server = new grpc.Server();

server.addService(AuthService, {
  checkToken(call: any, callback: any) {
    const token = call.request.getToken();
    const res = new CheckTokenRes();
    if (cache.has(token)) {
      const data = new CheckTokenResData();
      data.setAccount(cache.get(token));
      res.setData(data);
    } else {
      res.setError("token not found");
    }
    callback(null, res);
  },
});

server.bindAsync(
  "localhost:3333",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("grpc 服务启动");
  }
);
