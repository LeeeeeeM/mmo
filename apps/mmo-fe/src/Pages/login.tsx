import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import JSCrypto from "jsencrypt";

import { PublicKey } from "../common/private";
import NetworkManager from "../scripts/global/NetworkManager";
import { RpcFunc } from "../scripts/common";

const crypt = new JSCrypto();
crypt.setKey(PublicKey);

type FieldType = {
  account?: string;
  password?: string;
  remember?: string;
};

const connect = async (token: string) => {
  await NetworkManager.Instance.connect();
  const result = await NetworkManager.Instance.call(RpcFunc.enterGame, {
    token,
  });

  console.log("connect", result);
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  const account = crypt.encrypt(values.account!);
  const password = crypt.encrypt(values.password!);

  if (!account || !password) {
    console.log("用户名密码加密失败");
    return;
  }

  const params = {
    account,
    password,
  };

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  connect(res.token);
  console.log("登录结果", res);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const App: React.FC = () => (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Account"
      name="account"
      rules={[{ required: true, message: "Please input your account!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: "Please input your password!" }]}
    >
      <Input.Password />
    </Form.Item>

    {/* <Form.Item<FieldType>
      name="remember"
      valuePropName="checked"
      wrapperCol={{ offset: 8, span: 16 }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
