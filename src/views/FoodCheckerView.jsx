// src/views/FoodCheckerView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Typography, Spin, Alert, List, Dropdown, Menu } from 'antd';
import { SearchOutlined, CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ThunderboltOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './FoodCheckerView.css';

const { Title, Paragraph, Text } = Typography;

const hotDrugs = ['阿斯匹靈', '降血脂藥 (他汀類)', '二甲雙胍', '抗生素'];

const getRiskIcon = (level) => {
    const map = {
        '高風險': <WarningOutlined style={{ color: '#ff4d4f' }} />,
        '中風險': <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        '建議': <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    };
    return map[level] || <QuestionCircleOutlined />;
};

const getNutrientIcon = (nutrientName) => {
    const iconMap = {
        '輔酶Q10': <ThunderboltOutlined />,
        '維生素C': '🍊',
        '鐵': '🔩',
        '葉酸': '🌿',
        '益生菌': '🦠',
        '維生素B12': '💊',
        '維生素D': '☀️',
        '鎂': '✨',
        '鋅': '🧼',
        '維生素K': '🥬',
        'B群維生素': '💊',
        'Omega-3': '🐟',
        '膳食纖維': '🌾',
        '維生素B6': '🍌',
        '維生素B1': '🍚',
        '維生素B2': '🥛',
        '谷胱甘肽': '💪',
        '褪黑素': '😴',
        '鈣': '🦴',
        '鉀': '🍌',
        '生物素': '🥚',
        '硒': '🌰',
        '維生素A': '🥕',
    };
    return iconMap[nutrientName] || '🔹';
};


function FoodCheckerView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showInitialState, setShowInitialState] = useState(true);

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com';

    useEffect(() => {
        const fetchDrugNames = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                setSelectedDrug(null);
                setShowInitialState(true);
                return;
            }
            setLoading(true);
            setError(null);
            setShowInitialState(false);
            try {
                // *** 修改這裡的路徑：從 /api/search/drugs 改為 /api/list/drugs ***
                const response = await fetch(`${backendBaseUrl}/api/list/drugs`);
                if (!response.ok) throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
                const allDrugs = await response.json();
                
                const filtered = allDrugs.filter(drug => 
                    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (drug.category && drug.category.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setSearchResults(filtered);

            } catch (e) {
                console.error("無法載入藥物清單:", e);
                setError("無法載入藥物清單，請稍後再試。");
            } finally {
                setLoading(false);
            }
        };

        const handler = setTimeout(() => {
            fetchDrugNames();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const handleSelectDrug = async (drugName) => {
        setSearchTerm(drugName);
        setSearchResults([]);
        setLoading(true);
        setError(null);
        setShowInitialState(false);

        try {
            // *** 修改這裡的路徑：從 /api/drugs/ 改為 /api/drug/ ***
            const response = await fetch(`${backendBaseUrl}/api/drug/${encodeURIComponent(drugName)}`);
            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
            const drugDetails = await response.json();
            setSelectedDrug(drugDetails);
        } catch (e) {
            console.error("無法載入藥物詳細資訊:", e);
            setError("無法載入藥物詳細資訊，請稍後再試。");
            setSelectedDrug(null);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSelectedDrug(null);
        setError(null);
        setShowInitialState(true);
    };

    const handleHotSearchClick = (drugName) => {
        handleSelectDrug(drugName);
    };

    return (
        <div className="food-checker-container">
            <Title level={2} className="checker-title">飲食相容查詢器</Title>
            <Paragraph className="checker-intro">
                輸入您正在服用的藥物名稱，我們將為您分析其可能與飲食、營養素之間的交互影響。
            </Paragraph>

            <div className="search-input-wrapper">
                <Input.Search
                    placeholder="搜尋藥物名稱或成份"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={handleSelectDrug}
                    onClear={handleClear}
                />
                {searchTerm.length >= 2 && searchResults.length > 0 && (
                    <div className="search-results-dropdown">
                        <List
                            size="small"
                            bordered
                            dataSource={searchResults}
                            renderItem={item => (
                                <List.Item onClick={() => handleSelectDrug(item.name)}>
                                    <List.Item.Meta
                                        title={<a href="#">{item.name}</a>}
                                        description={item.category}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
                {searchTerm.length >= 2 && !loading && searchResults.length === 0 && (
                    <div className="no-results-message">沒有找到相關藥物。</div>
                )}
            </div>

            <div className="hot-searches-section">
                <Text strong>熱門查詢：</Text>
                <div className="hot-searches-tags">
                    {hotDrugs.map(drug => (
                        <Button 
                            key={drug} 
                            type="default" 
                            size="small" 
                            onClick={() => handleHotSearchClick(drug)}
                            className="hot-search-tag"
                        >
                            {drug}
                        </Button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="loading-spinner">
                    <Spin size="large" tip="載入中..." />
                </div>
            )}

            {error && (
                <Alert
                    message="載入失敗"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                />
            )}

            {showInitialState && !loading && !error && (
                <div className="initial-state-card">
                    <SearchOutlined className="initial-state-icon" />
                    <Title level={3}>開始查詢</Title>
                    <Paragraph>
                        輸入您正在服用的藥物名稱，<br />
                        我們將為您分析飲食相容性。
                    </Paragraph>
                </div>
            )}

            {selectedDrug && !loading && !error && (
                <div className="drug-detail-card">
                    <Title level={3} className="drug-name-header">
                        {selectedDrug.name} ({selectedDrug.category})
                    </Title>
                    
                    {selectedDrug.examples && selectedDrug.examples.length > 0 && (
                        <div className="section-block">
                            <Text strong>藥物名稱範例：</Text>
                            <ul className="item-list">
                                {selectedDrug.examples.map((example, index) => <li key={index}>{example}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="section-block">
                        <Text strong>可能導致的副作用/後遺症：</Text>
                        <ul className="item-list">
                            {selectedDrug.sideEffects.map((effect, index) => <li key={index}>{effect}</li>)}
                        </ul>
                    </div>

                    {selectedDrug.interactions && selectedDrug.interactions.length > 0 && (
                        <div className="section-block">
                            <Text strong>⚠️ 重要藥物食物交互作用：</Text>
                            <List
                                itemLayout="horizontal"
                                dataSource={selectedDrug.interactions}
                                renderItem={item => (
                                    <List.Item className={`interaction-item level-${item.level}`}>
                                        <List.Item.Meta
                                            avatar={getRiskIcon(item.level)}
                                            title={<Text>{item.trigger} ({item.level})</Text>}
                                            description={item.note}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <div className="section-block">
                        <Text strong>藥物在代謝過程中可能流失的營養素包括：</Text>
                        <div className="depleted-nutrients-tags">
                            {selectedDrug.depletedNutrients.map((nutrient, index) => (
                                <span key={index} className="nutrient-tag">
                                    {getNutrientIcon(typeof nutrient === 'object' ? nutrient.name : nutrient)} 
                                    {typeof nutrient === 'object' ? nutrient.name : nutrient}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="section-block">
                        <Text strong>🌿 建議的營養補充與注意事項：</Text>
                        <ul className="item-list">
                            {selectedDrug.solutions.map((solution, index) => <li key={index}>{solution}</li>)}
                        </ul>
                    </div>

                    {selectedDrug.naturalPrescriptions && selectedDrug.naturalPrescriptions.length > 0 && (
                        <div className="section-block">
                            <Text strong>🧘‍♀️ 建議的自然處方：</Text>
                            <ul className="item-list">
                                {selectedDrug.naturalPrescriptions.map((prescription, index) => (
                                    <li key={index}>{prescription}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Paragraph className="disclaimer-text">
                        本資訊僅供參考，請與您的醫師或藥師討論。
                    </Paragraph>
                </div>
            )}
        </div>
    );
}

export default FoodCheckerView;
