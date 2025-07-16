// src/views/ScenarioDetailView.jsx

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Collapse, Button, Card, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './ScenarioDetailView.css';

const { Title, Paragraph, Text } = Typography;

/**
 * 渲染帶有連結的答案
 * @param {string} answer - 包含【關鍵字】的答案文本
 * @param {object} links - 包含連結類型和關鍵字陣列的對象
 * @returns {Array} - React 元素陣列
 */
const renderAnswerWithLinks = (answer, links) => {
  if (!answer) return null;

  if (!links) {
    return (
      <Paragraph>
        {answer.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < answer.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </Paragraph>
    );
  }
  
  const allKeywords = Object.values(links).flat();
  if (allKeywords.length === 0) {
    return (
        <Paragraph>
            {answer.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < answer.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
        </Paragraph>
    );
  }

  const regex = new RegExp(`(【(?:${allKeywords.join('|')})】)`, 'g');
  const parts = answer.split(regex);

  return (
    <Paragraph>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          const keyword = part.replace(/[【】]/g, '');
          
          let linkType = '';
          for (const type in links) {
            if (links[type].includes(keyword)) {
              linkType = type.slice(0, -1);
              break;
            }
          }
          
          if (linkType) {
            return (
              <Link to={`/results/${linkType}/${keyword}`} key={index} className="inline-link">
                {part}
              </Link>
            );
          }
        }
        return part.split('\n').map((line, i) => (
          <React.Fragment key={`${index}-${i}`}>
            {line}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </Paragraph>
  );
};

// 生成底部相關連結標籤的輔助函數
const renderRelatedTags = (qaItem) => {
    const links = qaItem.related_links;
    if (!links) return null;

    const tags = [];
    if (links.nutrients) {
      links.nutrients.forEach(n => 
        tags.push(<Link to={`/results/nutrient/${n}`} key={`n-${n}`}><Tag color="blue">{n}</Tag></Link>)
      );
    }
    if (links.naturalPrescriptions) {
      links.naturalPrescriptions.forEach(p => 
        tags.push(<Link to={`/results/naturalPrescription/${p}`} key={`p-${p}`}><Tag color="green">{p}</Tag></Link>)
      );
    }
    return tags.length > 0 ? <div className="related-tags">{tags}</div> : null;
};


function ScenarioDetailView({ database }) {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = database?.scenarios?.[scenarioId];

  if (!scenario) {
    return (
      <Card style={{ textAlign: 'center', padding: '24px' }}>
        <Title level={4}>找不到對應的情境</Title>
        <Paragraph>請返回情境列表頁重新選擇。</Paragraph>
        <Button onClick={() => navigate('/scenarios')}>返回列表</Button>
      </Card>
    );
  }

  // --- Collapse 項目重構 ---
  // 根據 antd v5 建議，將 qa_list 轉換為 items 陣列
  const collapseItems = scenario.qa_list.map((qa, index) => ({
    key: index,
    label: <Text strong>{qa.question}</Text>,
    children: (
      <>
        {renderAnswerWithLinks(qa.answer, qa.related_links)}
        {renderRelatedTags(qa)}
      </>
    ),
  }));
  // -------------------------

  return (
    <div className="scenario-detail-container">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/scenarios')}
        className="back-button"
      >
        返回情境列表
      </Button>

      <Title level={2}>{scenario.icon} {scenario.name}</Title>
      <Paragraph className="scenario-description">{scenario.description}</Paragraph>
      
      {/* --- 使用新的 items 屬性來渲染 Collapse --- */}
      <Collapse 
        accordion 
        className="qa-collapse"
        items={collapseItems}
      />
      {/* ------------------------------------ */}

      {/* 小叮嚀區塊 */}
      {scenario.disclaimer && (
        <Card size="small" className="disclaimer-card">
          <Paragraph>📌 {scenario.disclaimer}</Paragraph>
        </Card>
      )}
    </div>
  );
}

export default ScenarioDetailView;