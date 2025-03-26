import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Select,
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const BRAND_OPTIONS = [
  "Suzuki swift 2004",
  "Maruti alto 800",
  "SUZUKI wagon R 2016",
  "Toyota corolla",
];

const PARTNAME_OPTIONS = [
  "Suspension springs(car lowering)",
  "Wheel offset and wheel cover modifications",
  "Front bumper and side ventilation modifications",
  "Spoiler and wing modifications",
];

const PartPage = () => {
  // Suppose we fetch shops for the user
  const [shops, setShops] = useState([]);
  // Suppose we fetch all parts
  const [parts, setParts] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");

  // For new/edit part
  const [partModalVisible, setPartModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [partForm] = Form.useForm();

  useEffect(() => {
    // Mock shops
    setShops([{ _id: "shop001", name: "My Car Shop" }]);
    // Mock parts
    setParts([
      {
        _id: "part001",
        code: "C001",
        name: "Suspension Springs",
        brandName: "Suzuki swift 2004",
        shopName: "My Car Shop",
        quantity: 10,
        mfd: "2023-01-10",
        createdDate: "2023-02-01",
        createdBy: "owner123",
      },
    ]);
  }, []);

  if (shops.length === 0) {
    return (
      <div
        style={{
          background: "#121212",
          minHeight: "100vh",
          padding: 40,
        }}
      >
        <Card
          style={{
            maxWidth: 600,
            margin: "0 auto",
            background: "#1E1E1E",
            border: "1px solid #333",
            boxShadow: "0 0 15px rgba(33, 150, 243, 0.3)",
            borderRadius: 8,
            padding: 20,
            textAlign: "center",
          }}
        >
          <Title level={3} style={{ color: "#fff" }}>
            Parts Management
          </Title>
          <Text style={{ color: "#fff" }}>
            Please create a shop to add parts available.
          </Text>
        </Card>
      </div>
    );
  }

  const columns = [
    {
      title: <Text style={{ color: "#fff" }}>Code</Text>,
      dataIndex: "code",
      key: "code",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
      fixed: "left",
    },
    {
      title: <Text style={{ color: "#fff" }}>Name</Text>,
      dataIndex: "name",
      key: "name",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>BrandName</Text>,
      dataIndex: "brandName",
      key: "brandName",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>ShopName</Text>,
      dataIndex: "shopName",
      key: "shopName",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Quantity</Text>,
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>MFD</Text>,
      dataIndex: "mfd",
      key: "mfd",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>CreatedDate</Text>,
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>CreatedBy</Text>,
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Action</Text>,
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredParts = parts.filter((p) =>
    brandFilter ? p.brandName === brandFilter : true
  );

  const handleAddNew = () => {
    setEditMode(false);
    setEditingPart(null);
    partForm.resetFields();
    setPartModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setEditingPart(record);
    partForm.setFieldsValue({
      code: record.code,
      name: record.name,
      brandName: record.brandName,
      shopName: record.shopName,
      quantity: record.quantity,
      mfd: record.mfd,
    });
    setPartModalVisible(true);
  };

  const handleDelete = (record) => {
    confirm({
      title: "Are you sure to delete this part?",
      icon: <ExclamationCircleOutlined />,
      content: record.name,
      onOk() {
        // deletePart(record._id)
        message.success("Part deleted!");
      },
    });
  };

  const handlePartSubmit = async (values) => {
    try {
      if (!editMode) {
        // create part
        // createPart(values)
        message.success("Part created!");
      } else {
        // update part
        // updatePart({ id: editingPart._id, ...values })
        message.success("Part updated!");
      }
      setPartModalVisible(false);
      partForm.resetFields();
      // refetch
    } catch (err) {
      console.error("Part submit error:", err);
      message.error("Failed to save part.");
    }
  };

  return (
    <>
      {/* Inline CSS for the Table */}
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
          <Title level={3} style={{ color: "#fff" }}>
            Parts Management
          </Title>

          {/* Brand Filter + Add New */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Select
              placeholder="Select Brand"
              allowClear
              style={{ width: 200, backgroundColor: "#000", color: "#0ff" }}
              onChange={(val) => setBrandFilter(val)}
            >
              {BRAND_OPTIONS.map((b) => (
                <Option key={b} value={b}>
                  {b}
                </Option>
              ))}
            </Select>
            <Button
              icon={<PlusOutlined />}
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "#000",
                fontWeight: "bold",
              }}
              onClick={handleAddNew}
            >
              Add New
            </Button>
          </div>

          <Table
            className="neon-table"
            columns={columns}
            dataSource={filteredParts}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* CREATE/EDIT PART MODAL */}
        <Modal
          title={editMode ? "Edit Part" : "Add Part"}
          visible={partModalVisible}
          onCancel={() => setPartModalVisible(false)}
          onOk={() => partForm.submit()}
        >
          <Form
            form={partForm}
            layout="vertical"
            onFinish={handlePartSubmit}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: "Please enter part code" }]}
            >
              <Input disabled={editMode} />
            </Form.Item>
            <Form.Item
              label="Part Name"
              name="name"
              rules={[{ required: true, message: "Please enter part name" }]}
            >
              <Select placeholder="Select part name">
                {PARTNAME_OPTIONS.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Brand Name"
              name="brandName"
              rules={[{ required: true, message: "Please select brand" }]}
            >
              <Select placeholder="Select brand">
                {BRAND_OPTIONS.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[{ required: true, message: "Please select shop" }]}
            >
              <Select placeholder="Select shop">
                {shops.map((s) => (
                  <Option key={s._id} value={s.name}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="MFD"
              name="mfd"
              rules={[{ required: true, message: "Please enter MFD date" }]}
            >
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default PartPage;
