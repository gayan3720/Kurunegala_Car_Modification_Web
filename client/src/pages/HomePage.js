import React from "react";
import { Card, Button, Typography, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import ML from "../assets/images/9150222.jpg";
import AR from "../assets/images/2101.i201.027.car_designer_profession_isometric.jpg";
import Design from "../assets/images/view-3d-car-with-sketch-effect.jpg";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <Title className="hero-title" level={1}>
            Car Modifications Reimagined
          </Title>
          <Text className="hero-text">
            Experience the future of car modifications with AR previews and
            ML-driven recommendations.
          </Text>
          <Button
            type="primary"
            shape="round"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate("/recognition")}
          >
            Explore Now
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card className="summary-card" bordered={false}>
              <img src={AR} alt="AR Preview" className="summary-image" />
              <Title level={4} className="card-title">
                Augmented Reality
              </Title>
              <Text className="card-text">
                Visualize car modifications in real time with our AR
                integration.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="summary-card" bordered={false}>
              <img
                src={ML}
                alt="ML Recommendations"
                className="summary-image"
              />
              <Title level={4} className="card-title">
                Machine Learning
              </Title>
              <Text className="card-text">
                Get personalized suggestions and compatibility checks tailored
                for your vehicle.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="summary-card" bordered={false}>
              <img
                src={Design}
                alt="Interactive Design"
                className="summary-image"
              />
              <Title level={4} className="card-title">
                Interactive Design
              </Title>
              <Text className="card-text">
                Experiment with different parts, colors, and designs to create
                your perfect ride.
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Call To Action Section */}
      <div className="cta-section">
        <Title level={2} className="cta-title">
          Ready to Transform Your Ride?
        </Title>
      </div>
    </div>
  );
};

export default HomePage;
