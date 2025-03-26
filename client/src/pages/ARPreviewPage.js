import susuki from "../assets/3d-models/suzuki_swift.glb";
import alto from "../assets/3d-models/2020_maruti_suzuki_alto_800.glb";
import wagonR from "../assets/3d-models/wagon_r.glb";
import corolla from "../assets/3d-models/corolla_ae104.glb";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Typography, message, Row, Col } from "antd";
import "@google/model-viewer";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Mock data for demonstration
const VEHICLE_MODELS = {
  SUZUKI_SWIFT_2004: {
    name: "Suzuki Swift 2004",
    modelUrl: susuki,
    partsPosition: {
      SPOILER: { x: 0, y: 0.4, z: -1.0 },
      BUMPER: { x: 0, y: 0.2, z: -0.8 },
    },
  },
  MARUTI_ALTO_800: {
    name: "Maruti Alto 800",
    modelUrl: alto,
    partsPosition: {
      SPOILER: { x: 0, y: 0.3, z: -0.9 },
    },
  },
  SUZUKI_WAGON_R: {
    name: "Suzuki Wagon R",
    modelUrl: wagonR,
    partsPosition: {
      SPOILER: { x: 0, y: 0.3, z: -0.9 },
    },
  },
  TOYOTA_COROLLA: {
    name: "Toyota Corolla",
    modelUrl: corolla,
    partsPosition: {
      SPOILER: { x: 0, y: 0.3, z: -0.9 },
    },
  },
};

const MODIFICATION_PARTS = {
  SPOILER: {
    name: "Sports Spoiler",
    modelUrl: "/models/sports_spoiler.glb",
    priceRange: "LKR 15,000 - 25,000",
  },
  LOWERING_SPRINGS: {
    name: "Lowering Springs Kit",
    modelUrl: "/models/lowering_springs.glb",
    priceRange: "LKR 35,000 - 50,000",
  },
};

const ARPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modelViewerRef = useRef(null);
  const partModelRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Get selected data from navigation state
  const { selectedCar, selectedPart, selectedShop } = location.state || {
    selectedCar: VEHICLE_MODELS.SUZUKI_SWIFT_2004,
    selectedPart: MODIFICATION_PARTS.SPOILER,
    selectedShop: {
      name: "Colombo Auto Mods",
      location: "Colombo 05",
      distance: "2.5 km",
    },
  };

  const partPosition = selectedCar.partsPosition[selectedPart?.type] || {
    x: 0,
    y: 0.5,
    z: -1.2,
  };

  useEffect(() => {
    if (!animationStarted) {
      setTimeout(() => animatePart(), 1000);
      setAnimationStarted(true);
    }
  }, [animationStarted]);

  const animatePart = () => {
    if (partModelRef.current) {
      partModelRef.current.setAttribute("animation-name", "moveToPosition");
    }
  };

  const handlePurchase = () => {
    message.success(`Redirecting to ${selectedShop.name} purchase page...`);
    // Add actual purchase logic here
  };

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          maxWidth: "900px",
          background: "#1E1E1E",
          border: "1px solid #333",
          boxShadow: "0 0 15px rgba(33, 150, 243, 0.3)",
          borderRadius: 8,
          padding: 20,
          textAlign: "center",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Button
              type="primary"
              shape="round"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Col>
          <Col>
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              {selectedCar.name} AR Preview
            </Title>
          </Col>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EnvironmentOutlined style={{ color: "#4CAF50" }} />
              <Text style={{ color: "#fff" }}>
                {selectedShop.distance} away
              </Text>
            </div>
          </Col>
        </Row>

        <Text style={{ color: "#bbb", display: "block", marginBottom: 20 }}>
          Previewing "{selectedPart.name}" from {selectedShop.name}
        </Text>

        {/* 3D Model Viewer */}
        <model-viewer
          ref={modelViewerRef}
          src={selectedCar.modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          style={{
            width: "100%",
            height: "500px",
            backgroundColor: "#000",
            margin: "20px 0",
          }}
        >
          <model-viewer
            ref={partModelRef}
            slot="ar-content"
            src={selectedPart.modelUrl}
            position={`${partPosition.x} ${partPosition.y + 1} ${
              partPosition.z - 2
            }`}
            animation-name="none"
          ></model-viewer>

          <style>
            {`
              model-viewer::part(moveToPosition) {
                transition: transform 2s ease-in-out;
                transform: translate3d(
                  ${partPosition.x}px,
                  ${partPosition.y}px,
                  ${partPosition.z}px
                );
              }
            `}
          </style>
        </model-viewer>

        {/* Shop and Part Details */}
        <Row gutter={16} style={{ margin: "20px 0" }}>
          <Col span={12}>
            <Card bordered={false} style={{ background: "#2A2A2A" }}>
              <Text strong style={{ color: "#fff" }}>
                Shop Details
              </Text>
              <div style={{ color: "#bbb", marginTop: 8 }}>
                <div>{selectedShop.name}</div>
                <div>{selectedShop.location}</div>
                <div>{selectedPart.priceRange}</div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Button
              block
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handlePurchase}
              style={{
                height: "100%",
                backgroundColor: "#4CAF50",
                border: "none",
                borderRadius: 8,
              }}
            >
              Purchase Now
            </Button>
          </Col>
        </Row>

        <Text style={{ color: "#666" }}>
          Use AR mode to see how this {selectedPart.name.toLowerCase()} will
          look on your actual vehicle
        </Text>
      </Card>
    </div>
  );
};

export default ARPreviewPage;
