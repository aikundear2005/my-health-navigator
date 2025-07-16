// src/views/ScenariosView.jsx (修正版：自行載入資料)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, Spin, Alert } from 'antd'; // 引入 Spin 和 Alert
import { CompassOutlined } from '@ant-design/icons';
import './ScenariosView.css'; // 確保這個 CSS 檔案存在

const { Title, Paragraph } = Typography;

function ScenariosView() {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true); // 新增載入狀態
    const [error, setError] = useState(null);   // 新增錯誤狀態

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com'; // 後端服務的 URL

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                setLoading(true); // 開始載入
                const response = await fetch(`${backendBaseUrl}/api/scenarios`);
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
                }
                const data = await response.json();
                setScenarios(data);
            } catch (e) {
                console.error("載入情境專區失敗:", e);
                setError("無法載入情境資料，請檢查後端服務或稍後再試。"); // 設定錯誤訊息
            } finally {
                setLoading(false); // 結束載入
            }
        };

        fetchScenarios();
    }, []);

    if (loading) {
        return (
            <div className="scenarios-loading">
                <Spin size="large" tip="情境資料載入中..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="scenarios-error">
                <Alert
                    message="載入情境失敗"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="scenarios-view-container">
            <Title level={2} className="scenarios-title"><CompassOutlined /> 情境專區</Title>
            <Paragraph className="scenarios-intro">
                根據您的生活情境，探索整合性的健康建議。
            </Paragraph>
            <Row gutter={[16, 16]} justify="center">
                {scenarios.map(scenario => (
                    <Col xs={24} sm={12} md={8} lg={6} key={scenario.id}> {/* 確保每個情境有唯一的 id */}
                        <Card
                            hoverable
                            className="scenario-card"
                            onClick={() => navigate(`/scenarios/${scenario.id}`)} // 使用 id 進行導航
                        >
                            <div className="scenario-icon">{scenario.icon}</div>
                            <Card.Meta title={scenario.name} description={scenario.description} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default ScenariosView;
