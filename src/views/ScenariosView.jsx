// src/views/ScenariosView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, Spin, Alert } from 'antd';
import { CompassOutlined } from '@ant-design/icons';
import './ScenariosView.css';

const { Title, Paragraph } = Typography;

function ScenariosView() {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com';

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                setLoading(true);
                // *** 修改這裡的路徑：從 /api/scenarios 改為 /api/list/scenarios ***
                const response = await fetch(`${backendBaseUrl}/api/list/scenarios`);
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
                }
                const data = await response.json();
                setScenarios(data);
            } catch (e) {
                console.error("載入情境專區失敗:", e);
                setError("無法載入情境資料，請檢查後端服務或稍後再試。");
            } finally {
                setLoading(false);
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
                    <Col xs={24} sm={12} md={8} lg={6} key={scenario.id}>
                        <Card
                            hoverable
                            className="scenario-card"
                            onClick={() => navigate(`/scenarios/${scenario.id}`)}
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
