// src/views/ScenarioDetailView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Alert, Collapse, Tag, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './ScenarioDetailView.css';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function ScenarioDetailView() {
    const { scenarioId } = useParams();
    const navigate = useNavigate();
    const [scenario, setScenario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com';

    useEffect(() => {
        const fetchScenarioDetail = async () => {
            try {
                setLoading(true);
                // *** 修改這裡的路徑：從 /api/scenarios/ 改為 /api/scenario/ ***
                const apiUrl = `${backendBaseUrl}/api/scenario/${encodeURIComponent(scenarioId)}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
                }
                const data = await response.json();
                setScenario(data);
            } catch (e) {
                console.error(`載入情境 ${scenarioId} 詳細失敗:`, e);
                setError("無法載入情境詳細資料，請檢查後端服務或稍後再試。");
            } finally {
                setLoading(false);
            }
        };

        if (scenarioId) {
            fetchScenarioDetail();
        }
    }, [scenarioId]);

    if (loading) {
        return (
            <div className="scenario-detail-loading">
                <Spin size="large" tip="情境詳情載入中..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="scenario-detail-error">
                <Alert
                    message="載入情境詳情失敗"
                    description={error}
                    type="error"
                    showIcon
                />
                <Button type="primary" onClick={() => navigate('/scenarios')} style={{ marginTop: '20px' }}>
                    返回情境列表
                </Button>
            </div>
        );
    }

    if (!scenario) {
        return (
            <div className="scenario-detail-not-found">
                <Alert
                    message="情境未找到"
                    description="抱歉，找不到您查詢的情境資訊。"
                    type="warning"
                    showIcon
                />
                <Button type="primary" onClick={() => navigate('/scenarios')} style={{ marginTop: '20px' }}>
                    返回情境列表
                </Button>
            </div>
        );
    }

    return (
        <div className="scenario-detail-container">
            <Button type="text" icon={<LeftOutlined />} onClick={() => navigate('/scenarios')} className="back-to-scenarios">
                返回情境專區
            </Button>
            <Title level={2} className="detail-title">{scenario.icon} {scenario.name}</Title>
            <Paragraph className="detail-description">{scenario.description}</Paragraph>

            <Collapse accordion defaultActiveKey={['0']} className="qa-collapse">
                {scenario.qa_list && scenario.qa_list.map((qa, index) => (
                    <Panel header={<Text strong>{qa.question}</Text>} key={String(index)}>
                        <Paragraph>{qa.answer}</Paragraph>
                        {(qa.related_links?.nutrients || qa.related_links?.naturalPrescriptions) && (
                            <div className="related-links-tags">
                                {qa.related_links.nutrients && qa.related_links.nutrients.map(n => (
                                    <Tag key={n} color="blue">{`營養素: ${n}`}</Tag>
                                ))}
                                {qa.related_links.naturalPrescriptions && qa.related_links.naturalPrescriptions.map(p => (
                                    <Tag key={p} color="green">{`自然處方: ${p}`}</Tag>
                                ))}
                            </div>
                        )}
                    </Panel>
                ))}
            </Collapse>
        </div>
    );
}

export default ScenarioDetailView;
