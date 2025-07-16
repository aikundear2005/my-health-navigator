// src/views/SearchView.jsx (修正版：按需載入資料)
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete, Tabs, Typography, Spin, Alert, Button, List } from 'antd'; // 引入 Spin, Alert, Button, List
import { SearchOutlined } from '@ant-design/icons';
import './SearchView.css';

const { Title, Paragraph } = Typography;

// 初始狀態顯示的組件
const EmptyState = ({ activeTabLabel }) => (
    <div className="search-empty-state">
        <div className="search-empty-icon"><SearchOutlined /></div>
        <div className="search-empty-title">開始查詢</div>
        <Paragraph className="search-empty-description">
            請在上方輸入關鍵字進行<Text strong>{activeTabLabel}</Text>查詢，<br />
            或點擊下方熱門選項快速探索。
        </Paragraph>
    </div>
);

// 為每個分類定義熱門查詢項目
// 注意：這裡的熱門查詢數據可以未來從後端獲取，目前先寫死
const hotSearches = {
    drug: ['降血脂藥 (他汀類)', '抗生素', '制酸劑 (胃藥)', '阿斯匹靈', '二甲雙胍'],
    symptom: ['疲勞/精力不足', '肌肉疼痛/抽筋', '記憶力下降/腦霧', '睡眠障礙/失眠'],
    nutrient: ['輔酶Q10', '維生素D', '鎂', 'B群維生素', '維生素C'],
    naturalPrescription: ['規律散步', '充足睡眠', '正念冥想', '森林浴'],
    lifestyleImpact: ['酒精', '壓力', '吸菸', '高糖/精緻飲食', '素食主義'],
};


function SearchView() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('drug');
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com'; // 後端服務的 URL

    const tabItems = [
        { key: 'drug', label: '藥物' },
        { key: 'symptom', label: '症狀' },
        { key: 'nutrient', label: '營養素' },
        { key: 'naturalPrescription', label: '自然處方' },
        { key: 'lifestyleImpact', label: '生活習慣' },
    ];

    // 處理搜尋框輸入與自動完成選項生成
    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (!value) {
            setOptions([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 使用新的 API 端點來獲取該分類下的所有名稱，然後在前端過濾
            const dataKey = tabItems.find(t => t.key === activeTab)?.key + 's'; // 獲取對應的複數名 (如 drugs)
            const response = await fetch(`${backendBaseUrl}/api/search/${dataKey}`);
            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
            const allItems = await response.json();

            const filteredOptions = allItems
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .map(item => ({
                    value: item.name,
                    label: (
                        <div className="search-suggestion-item">
                            <span>{item.name}</span>
                            <span className="search-suggestion-category">{item.category || item.type || activeTab}</span>
                        </div>
                    ),
                }));
            setOptions(filteredOptions);

        } catch (e) {
            console.error("搜尋建議載入失敗:", e);
            setError("無法載入搜尋建議，請稍後再試。");
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    // 當使用者從建議列表中選擇一項時
    const onSelect = (value) => {
        navigate(`/results/${activeTab}/${encodeURIComponent(value)}`);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setSearchTerm('');
        setOptions([]);
        setError(null); // 切換 Tab 時清除錯誤
    };

    const currentTabLabel = tabItems.find(t => t.key === activeTab)?.label;

    return (
        <div className="search-view-container">
            <Title level={2}>分類查詢</Title>
            <Paragraph style={{ color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
                透過分類與關鍵字，精準查找您需要的資訊。
            </Paragraph>

            <Tabs activeKey={activeTab} onChange={handleTabChange} type="card" items={tabItems} className="category-tabs" />

            <AutoComplete
                className="category-search-input"
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
                value={searchTerm}
                style={{ width: '100%' }}
                placeholder={`搜尋${currentTabLabel}名稱或相關關鍵字`} // 動態引導詞
                loading={loading}
            />
            {error && (
                <Alert
                    message="搜尋失敗"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    style={{ marginTop: '16px' }}
                />
            )}

            {/* 熱門查詢區塊 */}
            {searchTerm.length === 0 && (
                <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                    <Text strong>熱門查詢：</Text>
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(hotSearches[activeTab] || []).map(term => (
                            <Button
                                key={term}
                                onClick={() => navigate(`/results/${activeTab}/${encodeURIComponent(term)}`)}
                                style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '14px' }}
                            >
                                {term}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* 根據是否有搜尋詞來決定顯示初始畫面或無結果 */}
            {searchTerm.length === 0 && !loading && (
                <EmptyState activeTabLabel={currentTabLabel} />
            )}
            
            {searchTerm.length > 0 && !loading && options.length === 0 && (
                <div className="search-no-results">
                    在「{currentTabLabel}」分類下找不到結果。
                </div>
            )}
        </div>
    );
}

export default SearchView;
