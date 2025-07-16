// src/components/food-checker/EmptyState.jsx

import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './EmptyState.css';

const EmptyState = () => (
    <div className="empty-state">
        <div className="empty-icon"><SearchOutlined /></div>
        <div className="empty-title">開始查詢</div>
        <div className="empty-description">
            輸入您正在服用的藥物名稱，<br />
            我們將為您分析飲食相容性。
        </div>
    </div>
);

export default EmptyState;