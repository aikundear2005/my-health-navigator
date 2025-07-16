// src/components/food-checker/ResultCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tabs, Tag, Typography, Alert } from 'antd';
import { WarningOutlined, ExperimentOutlined, CloseCircleOutlined, BulbOutlined } from '@ant-design/icons';
import './ResultCard.css';

const { Text } = Typography;

// 獨立的互動建議項目組件
const InteractionItem = ({ item }) => {
    const riskClassMap = { '高風險': 'high-risk', '中風險': 'medium-risk', '建議': 'low-risk' };
    const iconMap = { '高風險': '🚫', '中風險': '⚠️', '建議': '💡' };
    return(
        <div className={`interaction-item ${riskClassMap[item.level]}`}>
            <div className="interaction-header">
                <span className="interaction-icon">{iconMap[item.level]}</span>
                <span className="interaction-title">{item.trigger}</span>
            </div>
            <div className="interaction-description">{item.note}</div>
        </div>
    );
};

const ResultCard = ({ drug }) => {

    const tabItems = [
        {
            key: 'interactions',
            label: <span><WarningOutlined /> 飲食互動建議</span>,
            children: (
                <div className="tab-content-inner">
                    {drug.interactions?.map((item, index) => <InteractionItem key={index} item={item} />)}
                </div>
            )
        },
        {
            key: 'nutrients',
            label: <span><ExperimentOutlined /> 營養素流失</span>,
            children: (
                <div className="tab-content-inner nutrient-tags">
                    {drug.depletedNutrients?.map((item, index) => (
                         <Link to={`/results/nutrient/${encodeURIComponent(item.name)}`} key={index}>
                            <div className="nutrient-tag">
                                <span>{item.icon}</span> {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            )
        }
    ];

    return (
        <Card className="result-card-wrapper">
            <div className="result-header">
                <div className="result-icon">💊</div>
                <div>
                    <div className="result-title">{drug.name}</div>
                    <div className="result-subtitle">{drug.category}</div>
                </div>
            </div>
            
            <Tabs defaultActiveKey="interactions" items={tabItems} />
            
            <Alert
                className="disclaimer"
                message="本資訊僅供參考，所有飲食與營養補充計畫，請務必與您的主治醫師或藥師討論。"
                type="info"
                showIcon
            />
        </Card>
    );
};

export default ResultCard;