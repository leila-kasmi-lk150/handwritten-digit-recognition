import {
  ClearOutlined,
  EditFilled,
  PlaySquareOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const { Text, Paragraph } = Typography;

function Demo() {
  const canvasRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
    setShowResult(false);
    setPrediction(0);
    setConfidence(0);
  };

  const predict = async () => {
    try {
      const imageDataUrl = await canvasRef.current.exportImage("png");

      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "digit.png");

      const result = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setShowResult(true);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };
  return (
    <div>
      <Paragraph>
        Drow a single digit (0-9), then click "Predict" button
      </Paragraph>
      <Row justify="center">
        <Col span={12}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Draw here <EditFilled />
          </Text>
          <div>
            <ReactSketchCanvas
              ref={canvasRef}
              width="280px"
              height="200px"
              strokeWidth={8}
              strokeColor="black"
              canvasColor="white"
              style={{
                border: "1px solid #ccc",
                marginBottom: 8,
                borderRadius: 8,
                cursor: "crosshair",
              }}
            />

            <Space style={{ marginTop: 16 }}>
              <Button icon={<ClearOutlined />} onClick={clearCanvas}>
                Clear
              </Button>
              <Button
                type="primary"
                icon={<PlaySquareOutlined />}
                onClick={predict}
              >
                Predict
              </Button>
            </Space>
          </div>
        </Col>
        <Col span={12}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Result
          </Text>
          <Card
            style={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #d9d9d9",
              borderRadius: 12,
              background: "#fafafa",
            }}
          >
            {/* Result */}
            {showResult ? (
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "#1677ff",
                  }}
                >
                  {prediction}
                </div>
                {/* <Tag color="blue" style={{ marginTop: 8 }}>
                  {(confidence * 100).toFixed(1)}% confidence
                </Tag>

                <Flex vertical gap="small" style={{ width: 200 }}>
                  <Progress
                    size={[300, 20]}
                    showInfo={false}
                    percent={confidence * 100}
                    strokeColor={"#1677ff"}
                  />
                </Flex> */}
              </div>
            ) : (
              <div>No prediction yet</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Demo;
