// src/views/FoodCheckerView.jsx

import React, { useState, useEffect } from 'react';
import { AutoComplete, Card, Tabs, Tag, Typography, Alert, Spin } from 'antd';
import { SafetyOutlined, ExperimentOutlined, WarningOutlined } from '@ant-design/icons';
import InteractionCard from '../components/shared/InteractionCard';
import EmptyState from '../components/food-checker/EmptyState';
import SearchSection from '../components/food-checker/SearchSection';
import ResultCard from '../components/food-checker/ResultCard';
import './FoodCheckerView.css';

const { Title, Paragraph } = Typography;

function FoodCheckerView() {
    const [allDrugs, setAllDrugs] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 初始設為 true 以載入藥物列表
    const [isSearching, setIsSearching] = useState(false); // 用於查詢單一藥物時的載入狀態
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDrugList = async () => {
            try {
                const response = await fetch('/api/list/drugs');
                if (!response.ok) throw new Error('無法獲取藥物列表');
                const data = await response.json();
                setAllDrugs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDrugList();
    }, []);

    const handleSelectDrug = (drugName) => {
        setIsSearching(true);
        const drug = allDrugs.find(d => d.name === drugName);
        
        setTimeout(() => {
            setSelectedDrug(drug);
            setIsSearching(false);
        }, 500);
    };

    // --- 修正：將 Spin 組件改為 fullscreen 模式 ---
    if (isLoading) {
        return <Spin fullscreen tip="正在初始化查詢器..." />;
    }

    if (error) {
        return <Alert message="錯誤" description={error} type="error" showIcon />;
    }

    return (
        <div className="food-checker-container">
            <header className="checker-header">
                <Title level={2} className="checker-title">🍽️ 飲食相容查詢器</Title>
                <Paragraph className="checker-subtitle">
                    正在服用特定藥物嗎？輸入藥物名稱，即可查詢建議留意或避免的飲食與生活習慣。
                </Paragraph>
            </header>
            
            <main className="checker-main-content">
                <SearchSection allDrugs={allDrugs} onSelectDrug={handleSelectDrug} />
                
                {isSearching && <div className="loading-spinner"><div></div></div>}

                {!isSearching && !selectedDrug && <EmptyState />}
                
                {!isSearching && selectedDrug && <ResultCard drug={selectedDrug} />}
            </main>
        </div>
    );
}

export default FoodCheckerView;
