// src/views/HomeView.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // 導入 useNavigate 鉤子
import { Typography, Button, Row, Col, Card } from 'antd';
import { CompassOutlined, AppstoreOutlined } from '@ant-design/icons';
import './HomeView.css'; // 引入對應的 CSS

const { Title, Paragraph } = Typography;

function HomeView() {
  // 使用 useNavigate 鉤子獲取導航函數
  const navigate = useNavigate();

  return (
    <div className="home-view-container">
      <div className="hero-section">
        <Title>歡迎來到 My Health Navigator</Title>
        <Paragraph className="hero-subtitle">
          您的個人化健康資訊導航。在這裡，您可以查詢藥物、症狀、營養素之間的交互影響，並探索基於生活情境的健康建議。
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={10}>
          <Card hoverable className="action-card">
            <div className="card-content">
              <AppstoreOutlined className="card-icon" />
              <Title level={3}>分類查詢</Title>
              <Paragraph>
                從藥物、症狀、營養素等特定分類開始，精準查找您需要的資訊。
              </Paragraph>
              {/* 使用 navigate 函數進行頁面跳轉 */}
              <Button 
                type="default" 
                size="large" 
                shape="round" 
                onClick={() => navigate('/search')}
              >
                開始查詢
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card hoverable className="action-card">
            <div className="card-content">
              <CompassOutlined className="card-icon" />
              <Title level={3}>情境專區</Title>
              <Paragraph>
                從您的生活情境出發，例如「壓力大」、「備孕」，獲取整合性的健康對策。
              </Paragraph>
               {/* 使用 navigate 函數進行頁面跳轉 */}
              <Button 
                type="primary" 
                size="large" 
                shape="round" 
                onClick={() => navigate('/scenarios')}
              >
                探索情境
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomeView;