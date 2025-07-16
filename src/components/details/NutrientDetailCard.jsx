// src/components/details/NutrientDetailCard.jsx

import React from 'react';
// 從 Ant Design 引入 Typography (用於標題和段落) 和 Card (用於內容卡片)
import { Typography, Card } from 'antd';
// 從輔助函數文件引入 renderNaturalPrescriptions 函數，用於渲染自然處方列表
import { renderNaturalPrescriptions } from '../../utils/helpers'; // 引入輔助函數，確保路徑正確

// 解構 Typography 的 Title 和 Paragraph 組件，方便使用
const { Title, Paragraph } = Typography;

/**
 * @function NutrientDetailCard
 * @description 營養素詳細資訊卡片組件。
 * 負責顯示單一營養素的詳細信息，包括其主要功能、食物來源、
 * 缺乏症狀、過量症狀，並可能包含相關的自然處方建議。
 * @param {Object} props - 組件屬性。
 * @param {Object} props.nutrientData - 營養素的詳細數據對象，包含所有相關資訊。
 * @param {Object} props.database - 完整的數據庫對象，用於在 renderNaturalPrescriptions 函數中查找自然處方詳情。
 */
function NutrientDetailCard({ nutrientData, database }) {
  // 強化解構賦值：確保 nutrientData 存在，如果不存在，則使用空對象。
  // 並為所有列表屬性提供空陣列作為預設值，避免對 undefined 調用 .map()。
  const {
    name, // name 屬性也可能為 undefined
    functions = [],
    sources = [],
    deficiencySymptoms = [],
    overdoseSymptoms = [],
    naturalPrescriptions = []
  } = nutrientData || {}; // 如果 nutrientData 本身是 undefined 或 null，解構成空對象

  // 如果 nutrientData 為空或 name 不存在，顯示提示
  if (!nutrientData || !name) {
    return (
      <Card className="result-card">
        <Paragraph style={{ textAlign: 'center', color: 'red' }}>
          營養素數據載入失敗或數據不完整。
        </Paragraph>
      </Card>
    );
  }

  return (
    // 卡片容器，應用 ResultsView.css 中的 .result-card 樣式
    <Card className="result-card">
      {/* 營養素主標題，顯示營養素名稱和圖標 */}
      <Title level={2}>🧬&nbsp;{name}</Title>
      
      {/* 主要功能區塊，僅在 functions 陣列有內容時顯示 */}
      {functions.length > 0 && (
        <>
          <Title level={4}>主要功能：</Title>
          {/* 遍歷並顯示每個功能為列表項 */}
          <ul>{functions.map(func => <li key={func}>{func}</li>)}</ul>
        </>
      )}
      
      {/* 主要食物來源區塊，僅在 sources 陣列有內容時顯示 */}
      {sources.length > 0 && (
        <>
          <Title level={4}>主要食物來源：</Title>
          {/* 遍歷並顯示每個食物來源為列表項 */}
          <ul>{sources.map(source => <li key={source}>{source}</li>)}</ul>
        </>
      )}
      
      {/* 缺乏症狀區塊，僅在 deficiencySymptoms 陣列有內容時顯示 */}
      {deficiencySymptoms.length > 0 && (
        <>
          <Title level={4}>缺乏症狀：</Title>
          {/* 遍歷並顯示每個缺乏症狀為列表項 */}
          <ul>{deficiencySymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
        </>
      )}
      
      {/* 過量症狀區塊，僅在 overdoseSymptoms 陣列有內容時顯示 */}
      {overdoseSymptoms.length > 0 && (
        <>
          <Title level={4}>過量症狀：</Title>
          {/* 遍歷並顯示每個過量症狀為列表項 */}
          <ul>{overdoseSymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
        </>
      )}
      
      {/* 建議的自然處方區塊，僅在 naturalPrescriptions 陣列有內容時使用輔助函數渲染 */}
      {/* 傳遞營養素關聯的自然處方列表和完整數據庫以供查詢詳情 */}
      {naturalPrescriptions.length > 0 && renderNaturalPrescriptions(naturalPrescriptions, database)}
      
      {/* 免責聲明 */}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與您的醫師或營養師討論。
      </Paragraph>
    </Card>
  );
}

export default NutrientDetailCard;