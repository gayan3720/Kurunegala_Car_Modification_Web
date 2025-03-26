import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  message,
  Image,
  Button,
  Upload,
  Select,
  InputNumber,
  Form,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Placeholder RTK Query hook
import { useRecognizeVehicleMutation } from "../redux/api_slices/vehicleApiSlice";

const { Title, Text } = Typography;
const { Option } = Select;

// Example neon marker icon
const neonIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Example list of modification parts
const PART_OPTIONS = [
  { value: "Suspension Springs", label: "Suspension Springs" },
  { value: "Bumper", label: "Bumper" },
  { value: "Spoiler", label: "Spoiler" },
];

// Placeholder shops data
const mockShops = [
  {
    id: "shopA",
    name: "Auto Modz",
    lat: 7.875,
    lng: 80.7718,
    distance: "2.5 km",
    hasPart: "Suspension Springs",
  },
  {
    id: "shopB",
    name: "CarTune Up",
    lat: 7.88,
    lng: 80.76,
    distance: "3.2 km",
    hasPart: "Bumper",
  },
];

const VehicleRecognitionPage = () => {
  const navigate = useNavigate();

  const [recognizeVehicle, { isLoading }] = useRecognizeVehicleMutation();
  const [fileList, setFileList] = useState([]);
  const [previewSrc, setPreviewSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [recognizedData, setRecognizedData] = useState(null);
  const [selectedPart, setSelectedPart] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Handle file selection
  const handleChange = (info) => {
    console.log(info);

    const newFileList = info.fileList;
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const rawFile = newFileList[0].originFileObj;
      if (rawFile) {
        setPreviewSrc(URL.createObjectURL(rawFile));
        // Store raw file in state so we can append to FormData
        setSelectedFile(rawFile);
      }
    } else {
      setPreviewSrc("");
      setSelectedFile(null);
    }
  };

  // 1) RECOGNIZE VEHICLE
  const handleRecognize = async () => {
    if (!selectedFile) return;
    try {
      // Build FormData
      console.log(selectedFile, "sel");

      const formData = new FormData();
      formData.append("vehicleImage", selectedFile);

      const response = await recognizeVehicle(formData).unwrap();
      setRecognizedData(response); // e.g. { recognizedModel: "...", labels: [...] }
      message.success("Vehicle recognized successfully!");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Recognition failed.");
    }
  };

  // 2) SELECT PART => FIND NEARBY SHOPS
  const handleFindShops = () => {
    if (!selectedPart) {
      return message.warning("Please select a part first.");
    }
    setShowMap(true);
    message.info(`Finding shops that have ${selectedPart}...`);
  };

  // 3) USER SELECTS A SHOP ON THE MAP
  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    message.info(`Selected shop: ${shop.name}`);
  };

  // 4) ENTER QUANTITY => GO TO AR
  const handlePreviewAR = () => {
    if (!selectedShop) {
      return message.warning("Please select a shop first.");
    }
    // Example: pass part name, quantity, shop, etc. to AR page
    navigate("/ar-preview", {
      state: {
        part: {
          name: selectedPart,
          modelUrl: "/models/suspension.glb", // or dynamic
          quantity,
          shopName: selectedShop.name,
        },
      },
    });
  };

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
        }}
      >
        <Title level={3} style={{ color: "#fff", textAlign: "center" }}>
          Vehicle Recognition
        </Title>

        {/* Step 1: Upload & Recognize */}
        {!recognizedData && (
          <Form onFinish={handleRecognize}>
            <Form.Item>
              <Upload
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false}
                maxCount={1}
                style={{ width: "100%" }}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    width: "100%",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    fontWeight: "bold",
                    marginTop: 16,
                  }}
                >
                  Select File
                </Button>
              </Upload>

              {previewSrc && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <Image
                    src={previewSrc}
                    alt="Preview"
                    style={{
                      maxHeight: 200,
                      borderRadius: 6,
                      objectFit: "cover",
                      border: "1px solid #333",
                    }}
                    preview
                  />
                </div>
              )}

              <Button
                htmlType="submit"
                loading={isLoading}
                disabled={!selectedFile}
                style={{
                  marginTop: 16,
                  width: "100%",
                  backgroundColor: "#00E676",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {isLoading ? "Recognizing..." : "Upload & Recognize"}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 2: Show recognition result => select part */}
        {recognizedData && !showMap && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                padding: 16,
                background: "#2E2E2E",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                Recognized Model:{" "}
              </Text>
              <Text style={{ color: "#fff" }}>
                {recognizedData.recognizedModel}
              </Text>
              <br />
              <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                Labels:{" "}
              </Text>
              <Text style={{ color: "#fff" }}>
                {recognizedData.labels?.join(", ")}
              </Text>
            </div>

            <Title level={5} style={{ color: "#fff" }}>
              Select a Modification Part
            </Title>
            <Select
              placeholder="Select part"
              style={{ width: "100%", backgroundColor: "#000", color: "#0ff" }}
              onChange={(val) => setSelectedPart(val)}
            >
              {PART_OPTIONS.map((p) => (
                <Option key={p.value} value={p.value}>
                  {p.label}
                </Option>
              ))}
            </Select>

            <Button
              onClick={handleFindShops}
              style={{
                marginTop: 16,
                width: "100%",
                backgroundColor: "#2196F3",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Find Nearby Shops
            </Button>
          </div>
        )}

        {/* Step 3: Show Map => select shop */}
        {recognizedData && showMap && (
          <div style={{ marginTop: 16 }}>
            <Title level={5} style={{ color: "#fff" }}>
              Nearby Shops with {selectedPart}
            </Title>

            <div
              style={{ height: 300, border: "1px solid #333", marginTop: 8 }}
            >
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={7}
                style={{ height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">
                    OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mockShops
                  .filter((shop) => shop.hasPart === selectedPart)
                  .map((shop) => (
                    <Marker
                      key={shop.id}
                      position={[shop.lat, shop.lng]}
                      icon={neonIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedShop(shop);
                          message.info(`Selected shop: ${shop.name}`);
                        },
                      }}
                    >
                      <Popup>
                        <div style={{ color: "#000" }}>
                          <strong>{shop.name}</strong>
                          <p>{shop.distance} away</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>

            {/* Step 4: Shop details + quantity */}
            {selectedShop && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#2E2E2E",
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  Selected Shop:
                </Text>{" "}
                <Text style={{ color: "#fff" }}>{selectedShop.name}</Text>
                <br />
                <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  Distance:
                </Text>{" "}
                <Text style={{ color: "#fff" }}>{selectedShop.distance}</Text>
                <br />
                <Text style={{ color: "#fff", marginTop: 8, display: "block" }}>
                  Enter Quantity:
                </Text>
                <InputNumber
                  min={1}
                  value={quantity}
                  onChange={(val) => setQuantity(val)}
                  style={{ width: "100%", marginTop: 8 }}
                />
                <Button
                  style={{
                    marginTop: 16,
                    width: "100%",
                    backgroundColor: "#FF9800",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    navigate("/ar-preview", {
                      state: {
                        part: {
                          name: selectedPart,
                          modelUrl: "/models/suspension.glb",
                          quantity,
                          shopName: selectedShop.name,
                        },
                      },
                    })
                  }
                >
                  Preview in AR
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default VehicleRecognitionPage;
