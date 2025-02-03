import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../store/auth/actions";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./forget-password";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<any>();
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const { payload } = await dispatch(loginAdmin(values));
      console.log(payload, "payload");

      if (payload.data.success) {
        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        message.success("Login Failed!");
      }
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl bg-white" bordered={false}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-700">
              Welcome Back
            </h1>
            <p className="mt-2 text-neutral-600">Sign in to your account</p>
          </div>

          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-primary-500" />}
                placeholder="Email"
                className="rounded-lg bg-primary-50"
              />
            </Form.Item>

            <Form.Item
              name="password"
              className="mt-4"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary-500" />}
                placeholder="Password"
                className="rounded-lg bg-primary-50 mt-4"
              />
            </Form.Item>

            <div className="flex justify-between mb-4">
              <p
                onClick={() => setForgotPasswordVisible(true)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </p>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg text-white font-medium bg-primary-600 active:!bg-primary-900 hover:!bg-primary-700"
            >
              Sign In
            </Button>
          </Form>
        </Card>
      </div>
      <ForgotPassword
        open={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
      />
    </div>
  );
};

export default Login;
