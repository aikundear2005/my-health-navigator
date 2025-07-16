// src/components/details/LifestyleImpactDetailCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Tag, List } from 'antd';

const { Title, Paragraph } = Typography;

function LifestyleImpactDetailCard({ impactData, database }) {
  // 這是最重要的防呆機制，確保 impactData 不是 undefined
  const {
    name,
    icon,
    impactSummary,
    affectedNutrients = [],
    recommendedActions = [],
    potentialHealthIssues = [],
    naturalPrescriptions = []
  } = impactData || {}; // 如果 impactData 是 undefined，則解構成空對象

  // 如果沒有數據，顯示錯誤提示，避免崩潰
  if (!impactData || !name) {
    return (
      <Card>
        <Paragraph style={{ color: 'red', textAlign: 'center' }}>
          生活習慣影響資料載入失敗或不完整。
        </Paragraph>
      </Card>
    );
  }

  return (
    <Card className="result-card">
      <Title level={2}>{icon}&nbsp;{name}</Title>
      
      <Paragraph style={{ fontSize: '16px', fontStyle: 'italic' }}>
        {impactSummary}
      </Paragraph>

      {affectedNutrients.length > 0 && (
        <>
          <Title level={4}>主要影響的營養素：</Title>
          <div className="tags-container">
            {affectedNutrients.map(nutrient => (
              <Link to={`/results/nutrient/${encodeURIComponent(nutrient)}`} key={nutrient}>
                <Tag color="purple">{nutrient}</Tag>
              </Link>
            ))}
          </div>
        </>
      )}

      {recommendedActions.length > 0 && (
        <>
          <Title level={4}>建議行動：</Title>
          <List
            dataSource={recommendedActions}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </>
      )}

      {potentialHealthIssues.length > 0 && (
        <>
            <Title level={4}>潛在的健康問題：</Title>
            <div className="tags-container">
                {potentialHealthIssues.map(issue => <Tag color="volcano" key={issue}>{issue}</Tag>)}
            </div>
        </>
      )}

      {naturalPrescriptions.length > 0 && (
         <>
            <Title level={4}>可搭配的自然處方：</Title>
            <div className="tags-container">
                {naturalPrescriptions.map(p => (
                    <Link to={`/results/naturalPrescription/${encodeURIComponent(p)}`} key={p}>
                        <Tag color="green">{p}</Tag>
                    </Link>
                ))}
            </div>
         </>
      )}

    </Card>
  );
}

export default LifestyleImpactDetailCard;