// src/components/details/DrugDetailCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Tag } from 'antd';
import InteractionCard from '../shared/InteractionCard'; // 導入共用組件

const { Title, Paragraph } = Typography;

function DrugDetailCard({ drugData }) {
  // 防呆機制，確保 drugData 不是 undefined
  const {
    name,
    category,
    interactions = [],
    depletedNutrients = []
  } = drugData || {};

  // 如果沒有數據，顯示錯誤提示，避免崩潰
  if (!drugData || !name) {
    return (
      <Card>
        <Paragraph style={{ color: 'red', textAlign: 'center' }}>
          藥物資料載入失敗或不完整。
        </Paragraph>
      </Card>
    );
  }

  return (
    <Card className="result-card">
      <Title level={2}>💊&nbsp;{name}</Title>
      <Tag color="geekblue" style={{ marginBottom: '24px' }}>{category}</Tag>
      
      {interactions.length > 0 && (
        <>
          <Title level={4}>飲食與藥物互動建議</Title>
          {interactions.map((item, index) => (
            <InteractionCard key={index} item={item} />
          ))}
        </>
      )}
      
      {depletedNutrients.length > 0 && (
        <>
          <Title level={4}>可能耗損的關鍵營養素</Title>
          <div className="tags-container" style={{ marginTop: '16px' }}>
            {depletedNutrients.map((nutrient, index) => (
              <Link to={`/results/nutrient/${encodeURIComponent(nutrient.name)}`} key={index}>
                <Tag className="depleted-tag" icon={<span>{nutrient.icon}</span>}>{nutrient.name}</Tag>
              </Link>
            ))}
          </div>
        </>
      )}

      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
        本資訊僅供參考，請與您的醫師或藥師討論。
      </Paragraph>
    </Card>
  );
}

export default DrugDetailCard;