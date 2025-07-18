// src/views/ResultsView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, Alert, List, Tag, Button } from 'antd';
import { LeftOutlined, WarningOutlined, ExclamationCircleOutlined, InfoCircleOutlined, ThunderboltOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './ResultsView.css';

const { Title, Paragraph, Text } = Typography;

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


function ResultsView() {
    const { type, itemKey } = useParams();
    const navigate = useNavigate();
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendBaseUrl = 'https://proactive-health-backend.onrender.com';

    useEffect(() => {
        const fetchItemDetail = async () => {
            try {
                setLoading(true);
                // *** 修改這裡的路徑：使用後端定義的單數 type ***
                const apiUrl = `${backendBaseUrl}/api/${type}/${encodeURIComponent(itemKey)}`;
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
                }
                const data = await response.json();
                setItemData(data);
            } catch (e) {
                console.error(`載入 ${type} - ${itemKey} 詳細失敗:`, e);
                setError("無法載入詳細資訊，請檢查後端服務或稍後再試。");
                setItemData(null);
            } finally {
                setLoading(false);
            }
        };

        if (type && itemKey) {
            fetchItemDetail();
        }
    }, [type, itemKey]);

    const getTitleIcon = (itemType) => {
        switch(itemType) {
            case 'drug': return '💊';
            case 'symptom': return '🩺';
            case 'nutrient': return '🌿';
            case 'naturalPrescription': return itemData?.icon || '🧘‍♀️'; // 後端是 naturalPrescriptions
            case 'lifestyleImpact': return itemData?.icon || '☀️'; // 後端是 lifestyleImpacts
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="results-loading">
                <Spin size="large" tip="資料載入中..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-error">
                <Alert
                    message="載入失敗"
                    description={error}
                    type="error"
                    showIcon
                />
                <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                    返回上一頁
                </Button>
            </div>
        );
    }

    if (!itemData) {
        return (
            <div className="results-not-found">
                <Alert
                    message="未找到資訊"
                    description="抱歉，找不到您查詢的項目資訊。"
                    type="warning"
                    showIcon
                />
                <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                    返回上一頁
                </Button>
            </div>
        );
    }

    const itemCategory = itemData.category || (type === 'drug' ? '藥物' : type === 'symptom' ? '症狀' : ''); // 根據type判斷顯示Category

    return (
        <div className="results-view-container">
            <Button type="text" icon={<LeftOutlined />} onClick={() => navigate(-1)} className="back-button-results">
                返回
            </Button>
            <Title level={2} className="results-title">
                <span className="results-icon">{getTitleIcon(type)}</span> {itemData.name}
            </Title>
            {itemCategory && <Paragraph className="results-category">{itemCategory}</Paragraph>}

            <div className="result-content-wrapper">
                {/* 根據 type 渲染不同內容，這裡需要完整的 renderContent 邏輯 */}
                {/* 我將在下面提供完整的 renderContent 函數內容，請將其貼入 ResultsView 組件內 */}
                {
                    (() => {
                        switch (type) {
                            case 'drug':
                                return (
                                    <>
                                        {itemData.examples && itemData.examples.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>藥物名稱範例：</Text>
                                                <ul className="item-list">
                                                    {itemData.examples.map((example, index) => <li key={index}>{example}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="section-block">
                                            <Text strong>可能導致的副作用/後遺症：</Text>
                                            <ul className="item-list">
                                                {itemData.sideEffects.map((effect, index) => <li key={index}>{effect}</li>)}
                                            </ul>
                                        </div>
                                        {itemData.interactions && itemData.interactions.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>⚠️ 重要藥物食物交互作用：</Text>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={itemData.interactions}
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
                                                {itemData.depletedNutrients.map((nutrient, index) => (
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
                                                {itemData.solutions.map((solution, index) => <li key={index}>{solution}</li>)}
                                            </ul>
                                        </div>
                                        {itemData.naturalPrescriptions && itemData.naturalPrescriptions.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>🧘‍♀️ 建議的自然處方：</Text>
                                                <ul className="item-list">
                                                    {itemData.naturalPrescriptions.map((prescription, index) => (
                                                        <li key={index}>{prescription}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            case 'symptom':
                                return (
                                    <>
                                        <div className="section-block">
                                            <Text strong>可能的原因 (藥物或營養缺乏)：</Text>
                                            <ul className="item-list">
                                                {itemData.possibleCauses.map((cause, index) => <li key={index}>{cause}</li>)}
                                            </ul>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>🌿 建議的營養補充方案：</Text>
                                            <ul className="item-list">
                                                {itemData.solutions.map((solution, index) => <li key={index}><strong>{solution.nutrient}：</strong>{solution.recommendation}</li>)}
                                            </ul>
                                        </div>
                                        {itemData.naturalPrescriptions && itemData.naturalPrescriptions.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>🧘‍♀️ 建議的自然處方：</Text>
                                                <ul className="item-list">
                                                    {itemData.naturalPrescriptions.map((prescription, index) => (
                                                        <li key={index}>{prescription}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            case 'nutrient':
                                return (
                                    <>
                                        <div className="section-block">
                                            <Text strong>重要性與主要作用：</Text>
                                            <Paragraph>{itemData.importance || itemData.functions?.join('、')}</Paragraph>
                                        </div>
                                        {itemData.depletedBy && itemData.depletedBy.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>哪些藥物或生活方式會消耗它？</Text>
                                                <ul className="item-list">
                                                    {itemData.depletedBy.map((depleter, index) => <li key={index}>{depleter}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="section-block">
                                            <Text strong>缺乏時可能出現的症狀：</Text>
                                            <ul className="item-list">
                                                {itemData.deficiencySymptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                                            </ul>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>🍽️ 富含此營養素的在地食物來源：</Text>
                                            <ul className="item-list">
                                                {itemData.foodSources.map((source, index) => <li key={index}>{source}</li>)}
                                            </ul>
                                        </div>
                                    </>
                                );
                            case 'naturalPrescription': // 注意這裡的 type 是 naturalPrescription (單數)
                                return (
                                    <>
                                        <div className="section-block">
                                            <Text strong>重要性與主要作用：</Text>
                                            <Paragraph>{itemData.importance}</Paragraph>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>缺乏時可能出現的症狀：</Text>
                                            <ul className="item-list">
                                                {itemData.deficiencySymptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                                            </ul>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>可以怎麼做？</Text>
                                            <ul className="item-list">
                                                <li><strong>📍 可以去哪裡：</strong>{itemData.prescription.where.join('、')}</li>
                                                <li><strong>⏱️ 花多久時間：</strong>{itemData.prescription.howLong}</li>
                                            </ul>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>🔔 適合時機與注意事項：</Text>
                                            <ul className="item-list">
                                                <li><strong>☀️ 適合時機：</strong>{itemData.timingAndPrecautions.timing}</li>
                                                <li><strong>🎒 需要準備：</strong>{itemData.timingAndPrecautions.preparation}</li>
                                                <li><strong>⚠️ 注意事項：</strong>{itemData.timingAndPrecautions.reminders}</li>
                                            </ul>
                                        </div>
                                    </>
                                );
                            case 'lifestyleImpact': // 注意這裡的 type 是 lifestyleImpact (單數)
                                return (
                                    <>
                                        <div className="section-block">
                                            <Text strong>影響摘要：</Text>
                                            <Paragraph>{itemData.impactSummary}</Paragraph>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>可能流失的營養素：</Text>
                                            <div className="depleted-nutrients-tags">
                                                {itemData.depletedNutrients.map((nutrient, index) => (
                                                    <span key={index} className="nutrient-tag">
                                                        {getNutrientIcon(typeof nutrient === 'object' ? nutrient.name : nutrient)}
                                                        {typeof nutrient === 'object' ? nutrient.name : nutrient}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="section-block">
                                            <Text strong>💡 我們的建議：</Text>
                                            <ul className="item-list">
                                                {itemData.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                            </ul>
                                        </div>
                                        {itemData.naturalPrescriptions && itemData.naturalPrescriptions.length > 0 && (
                                            <div className="section-block">
                                                <Text strong>🧘‍♀️ 建議的自然處方：</Text>
                                                <ul className="item-list">
                                                    {itemData.naturalPrescriptions.map((prescription, index) => (
                                                        <li key={index}>{prescription}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            default:
                                return <Alert message="不明的查詢類型" type="warning" showIcon />;
                        }
                    })()
                }
            </div>

            <Paragraph className="disclaimer-text">
                本資訊僅供參考，不能取代專業醫療建議。在調整任何藥物治療或營養補充計劃前，請務必諮詢您的醫師或藥師。每個人的身體狀況不同，營養需求也會因個人差異而有所不同。切勿自行停藥。
            </Paragraph>
        </div>
    );
}

export default ResultsView;
