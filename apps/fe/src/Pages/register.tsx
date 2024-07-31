import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import JSCrypto from "jsencrypt";

import { PublicKey } from "@mmo/common/private";

const crypt = new JSCrypto();
crypt.setKey(PublicKey);

type FieldType = {
  account?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  console.log("Success:", values);
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

  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  console.log("注册结果", res);
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

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
