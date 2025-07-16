// src/views/ScenariosView.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import './ScenariosView.css'; // <-- 將 CSS import 移到所有 import 語句的末尾

const { Title, Paragraph } = Typography;
const { Meta } = Card;

function ScenariosView({ database }) {
  // 從 database 中獲取 scenarios，如果不存在則使用空對象
  const scenarios = database?.scenarios || {};

  return (
    <div className="scenarios-view-container">
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        常見情境與對應建議
      </Title>
      <Paragraph style={{ textAlign: 'center', marginBottom: '40px', fontSize: '16px' }}>
        您是否正面臨以下情況？點擊卡片，探索更貼近您生活的整合性建議。
      </Paragraph>
      <Row gutter={[24, 24]}>
        {Object.entries(scenarios).map(([id, scenario]) => (
          <Col xs={24} sm={12} md={8} key={id}>
            <Link to={`/scenarios/${id}`}>
              <Card
                hoverable
                className="scenario-card"
              >
                <Meta
                  avatar={<span className="scenario-icon">{scenario.icon}</span>}
                  title={<Title level={4}>{scenario.name}</Title>}
                  description={<Paragraph ellipsis={{ rows: 3 }}>{scenario.description}</Paragraph>}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ScenariosView;