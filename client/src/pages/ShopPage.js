import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Example brand options
const BRAND_OPTIONS = [
  "Suzuki swift 2004",
  "Maruti alto 800",
  "SUZUKI wagon R 2016",
  "Toyota corolla",
];

// Example neon marker icon
const neonIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ShopPage = () => {
  // Suppose we fetch shops from an API
  // For demonstration, let's store them in local state
  const [shops, setShops] = useState([]);

  // "New Shop" modal
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [shopForm] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  // Map states for new shop creation
  const [mapCenter] = useState([7.8731, 80.7718]);
  const [markerPos, setMarkerPos] = useState([7.8731, 80.7718]);

  // Example effect: load shops
  useEffect(() => {
    // Mock data
    setShops([
      {
        _id: "shop001",
        shopCode: "S001",
        name: "My Car Shop",
        owner: "owner123",
        location: { lat: 7.85, lng: 80.77 },
        createdDate: "2023-03-01",
        createdBy: "owner123",
        brands: ["Suzuki swift 2004", "Toyota corolla"],
      },
    ]);
  }, []);

  // Table columns
  const columns = [
    {
      title: <Text style={{ color: "#fff" }}>ShopCode</Text>,
      dataIndex: "shopCode",
      key: "shopCode",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
      fixed: "left",
    },
    {
      title: <Text style={{ color: "#fff" }}>ShopName</Text>,
      dataIndex: "name",
      key: "name",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Owner</Text>,
      dataIndex: "owner",
      key: "owner",
      render: (text) => <Text style={{ color: "#fff" }}>{text}</Text>,
    },
    {
      title: <Text style={{ color: "#fff" }}>Location</Text>,
      key: "location",
      render: (_, record) => {
        const { lat, lng } = record.location || {};
        return (
          <Text style={{ color: "#fff" }}>
            {lat && lng
              ? `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`
              : "N/A"}
          </Text>
        );
      },
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
              onClick={() => handleEditShop(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteShop(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleNewShop = () => {
    setEditMode(false);
    setEditingShop(null);
    shopForm.resetFields();
    // Reset marker to default
    setMarkerPos([7.8731, 80.7718]);
    setShopModalVisible(true);
  };

  const handleEditShop = (shop) => {
    setEditMode(true);
    setEditingShop(shop);
    shopForm.setFieldsValue({
      shopCode: shop.shopCode,
      name: shop.name,
      brands: shop.brands,
    });
    if (shop.location) {
      setMarkerPos([shop.location.lat, shop.location.lng]);
    }
    setShopModalVisible(true);
  };

  const handleDeleteShop = (shop) => {
    confirm({
      title: "Are you sure you want to delete this shop?",
      icon: <ExclamationCircleOutlined />,
      content: shop.name,
      onOk() {
        // deleteShop(shop._id)
        message.success("Shop deleted!");
      },
    });
  };

  const handleShopSubmit = async (values) => {
    try {
      const { shopCode, name, brands } = values;
      const [lat, lng] = markerPos;

      if (!editMode) {
        // create new shop
        // await createShop({ shopCode, name, brands, lat, lng })
        message.success("Shop created!");
      } else {
        // update existing shop
        // await updateShop({ id: editingShop._id, ...values, lat, lng })
        message.success("Shop updated!");
      }
      setShopModalVisible(false);
      shopForm.resetFields();
      // refetch shops
    } catch (err) {
      console.error("Shop submit error:", err);
      message.error("Failed to save shop.");
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3} style={{ color: "#fff" }}>
              Shops
            </Title>
            <Button
              icon={<PlusOutlined />}
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "#000",
                fontWeight: "bold",
              }}
              onClick={handleNewShop}
            >
              New Shop
            </Button>
          </div>

          <Table
            className="neon-table"
            columns={columns}
            dataSource={shops}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* CREATE/EDIT SHOP MODAL */}
        <Modal
          title={editMode ? "Edit Shop" : "New Shop"}
          visible={shopModalVisible}
          onCancel={() => setShopModalVisible(false)}
          onOk={() => shopForm.submit()}
          okText={editMode ? "Update" : "Create"}
        >
          <Form
            form={shopForm}
            layout="vertical"
            onFinish={handleShopSubmit}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              label="Shop Code"
              name="shopCode"
              rules={[{ required: true, message: "Please enter shop code" }]}
            >
              <Input disabled={editMode} />
            </Form.Item>
            <Form.Item
              label="Shop Name"
              name="name"
              rules={[{ required: true, message: "Please enter shop name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Vehicle Brands"
              name="brands"
              rules={[
                {
                  required: true,
                  message: "Please select at least one brand",
                },
              ]}
            >
              <Select mode="multiple" placeholder="Select brands">
                {BRAND_OPTIONS.map((b) => (
                  <Option key={b} value={b}>
                    {b}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Text>Shop Location (drag marker)</Text>
            <div
              style={{ height: 300, border: "1px solid #ccc", marginTop: 8 }}
            >
              <MapContainer
                center={mapCenter}
                zoom={7}
                style={{ height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">
                    OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  draggable
                  position={markerPos}
                  icon={neonIcon}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const pos = marker.getLatLng();
                      setMarkerPos([pos.lat, pos.lng]);
                    },
                  }}
                >
                  <Popup>Drag to set location</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ShopPage;
