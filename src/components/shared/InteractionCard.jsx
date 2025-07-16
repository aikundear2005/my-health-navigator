// src/components/shared/InteractionCard.jsx

import React from 'react';
import { Typography, Alert } from 'antd';
import { WarningOutlined, BulbOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const InteractionCard = ({ item }) => {
    const colorMap = {
        '高風險': 'error',
        '中風險': 'warning',
        '建議': 'success',
    };
    const iconMap = {
        '高風險': <CloseCircleOutlined />,
        '中風險': <WarningOutlined />,
        '建議': <BulbOutlined />,
    };

    return (
        <Alert
            message={<Text strong>{item.trigger}</Text>}
            description={item.note}
            type={colorMap[item.level] || 'info'}
            showIcon
            icon={iconMap[item.level] || <WarningOutlined />}
            style={{ marginBottom: '16px' }}
        />
    );
};

export default InteractionCard;