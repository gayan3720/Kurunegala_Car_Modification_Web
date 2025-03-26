import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Modal,
  Form,
  Select,
  message,
  Tooltip,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { roles } from "../utils/enum";
import {
  useDeleteUserMutation,
  useGetAllQuery,
  useUpdateUserMutation,
} from "../redux/api_slices/userApiSlice";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Example role options
const ROLE_OPTIONS = [
  { id: roles.Admin, name: "Admin" },
  { id: roles.ShopOwner, name: "Shop Owner" },
  { id: roles.Customer, name: "Customer" },
];

const UserPage = () => {
  // Sample users (In real scenario, fetch from an API)
  const { data: userList, isSuccess: isGetAllSuccess } = useGetAllQuery();
  console.log(userList);

  const [updatedUser, { data: userUpdate, isSuccess: isUpdateSuccess }] =
    useUpdateUserMutation();
  const [deleteUser, { data: userDelete, isSuccess: isDeleteSuccess }] =
    useDeleteUserMutation();
  const [users, setUsers] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (userList && userList.length > 0) {
      const newList = userList?.map((i) => {
        return { ...i, key: i._id };
      });
      newList.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
      setUsers(newList);
    } else {
      setUsers([]);
    }
  }, [userList]);

  const columns = [
    {
      title: <Text style={{ color: "#fff" }}>Username</Text>,
      dataIndex: "name",
      key: "name",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Email</Text>,
      dataIndex: "email",
      key: "email",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Role</Text>,
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Text style={{ color: "#fff" }}>
          {text === roles.Admin
            ? "Admin"
            : text === roles.ShopOwner
            ? "Shop Owner"
            : text === roles.Customer
            ? "Customer"
            : ""}
        </Text>
      ),
    },
    {
      title: <Text style={{ color: "#fff" }}>Created Date</Text>,
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <Text style={{ color: "#fff" }}>
          {text ? moment(text).format("DD/MM/YYYY HH:mm") : "N/A"}
        </Text>
      ),
    },
    {
      title: <Text style={{ color: "#fff" }}>Action</Text>,
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Edit Role">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteUser(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleEditUser = (user) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      role: user.role,
      name: user.name,
      email: user.email,
    });
    setUserModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    console.log(user, "us");
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this user?",
      async onOk() {
        console.log(user, "us");
        await deleteUser({ id: user._id }).unwrap();
        message.success("User deleted.");
        // Perform the action here (e.g., API call, database update, etc.)
      },
      onCancel() {
        console.log("Action canceled!");
      },
    });
  };

  const handleUserSubmit = async (values) => {
    try {
      const { role } = values;
      if (editingUser) {
        const result = await updatedUser({ ...editingUser, role }).unwrap();
        if (result) {
          if (result.result === 1) {
            message.success("User role updated.");
            setUserModalVisible(false);
            userForm.resetFields();
          } else {
            message.warning("Failed to upload.");
          }
        } else {
          message.error("Internal server error.");
        }
      }
    } catch (err) {
      console.error("User submit error:", err);
      message.error("Failed to update user.");
    }
  };

  return (
    <>
      {/* Inline CSS for neon table styling */}
      <style>
        {`
          .neon-table .ant-table-thead > tr > th {
            background-color: #333 !important;
            color: #fff !important;
          }
          .neon-table .ant-table-tbody > tr > td {
            background-color: #1E1E1E !important;
            color: #fff !important;
            border-bottom: 1px solid #333 !important;
          }
          .neon-table .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: #2E2E2E !important;
          }
          .neon-table .ant-pagination-options {
            background-color: #1E1E1E !important;
          }
          .neon-table .ant-table {
            background-color: #1E1E1E !important;
          }
        `}
      </style>

      <div
        style={{
          background: "#121212",
          minHeight: "100vh",
          padding: 40,
        }}
      >
        <Card
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            background: "#1E1E1E",
            border: "1px solid #333",
            boxShadow: "0 0 15px rgba(33, 150, 243, 0.3)",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ color: "#fff" }}>
              User Management
            </Title>
            {/* Optionally, a New User button can be added if required */}
          </div>

          <Table
            className="neon-table"
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* EDIT USER ROLE MODAL */}
        <Modal
          title="Edit User Role"
          visible={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          onOk={() => userForm.submit()}
          okText="Update"
        >
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleUserSubmit}
            style={{ marginTop: 16 }}
          >
            <Form.Item label="Username" name="name">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select user role">
                {ROLE_OPTIONS.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default UserPage;
