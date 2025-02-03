import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import { forgetEmail, forgetEmailVerify } from "../../store/auth/actions";
import { MailOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<any>();

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      const { payload } = await dispatch(forgetEmail({ email: values.email }));
      if (payload.data.success) {
        setEmail(values.email);
        setStep(2);
        message.success("OTP sent to your email!");
      }
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (values: { otp: string; newPassword: string }) => {
    try {
      setLoading(true);
      const { payload } = await dispatch(
        forgetEmailVerify({
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        })
      );
      if (payload.data.success) {
        message.success("Password reset successful!");
        onClose();
      }
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      className="p-0"
    >
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <Title level={3} className="!mb-2 text-primary-700">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </Title>
          <Text className="text-neutral-600">
            {step === 1 
              ? "Enter your email to receive a verification code" 
              : "Enter the verification code and your new password"}
          </Text>
        </div>

        {step === 1 ? (
          <Form 
            layout="vertical" 
            onFinish={handleEmailSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="email"
              className="mb-8"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-primary-500 mr-2" />}
                placeholder="Enter your email"
                className="rounded-lg h-12 bg-primary-50 text-base"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg text-white font-medium bg-primary-600 hover:!bg-primary-700 text-base"
              size="large"
            >
              Send Verification Code
            </Button>
          </Form>
        ) : (
          <Form 
            layout="vertical" 
            onFinish={handleResetSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="otp"
              className="mb-6"
              rules={[{ required: true, message: "Please input OTP!" }]}
            >
              <Input
                prefix={<KeyOutlined className="text-primary-500 mr-2" />}
                placeholder="Enter verification code"
                className="rounded-lg h-12 bg-primary-50 text-base"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              className="mb-8"
              rules={[
                { required: true, message: "Please input new password!" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary-500 mr-2" />}
                placeholder="Enter new password"
                className="rounded-lg h-12 bg-primary-50 text-base"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg text-white font-medium bg-primary-600 hover:!bg-primary-700 text-base"
              size="large"
            >
              Reset Password
            </Button>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPassword;