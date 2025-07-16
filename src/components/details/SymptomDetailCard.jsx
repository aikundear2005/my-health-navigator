// src/components/details/SymptomDetailCard.jsx

import React from 'react';
// 從 Ant Design 引入 Typography (用於標題和段落) 和 Card (用於內容卡片)
import { Typography, Card } from 'antd';
// 從輔助函數文件引入 renderNaturalPrescriptions 函數，用於渲染自然處方列表
import { renderNaturalPrescriptions } from '../../utils/helpers'; // 引入輔助函數，確保路徑正確

// 解構 Typography 的 Title 和 Paragraph 組件，方便使用
const { Title, Paragraph } = Typography;

/**
 * @function SymptomDetailCard
 * @description 症狀詳細資訊卡片組件。
 * 負責顯示單一症狀的詳細信息，包括可能原因、居家照護建議，
 * 以及何時需要就醫的指引，並可能包含相關的自然處方建議。
 * @param {Object} props - 組件屬性。
 * @param {Object} props.symptomData - 症狀的詳細數據對象，包含所有相關資訊。
 * @param {Object} props.database - 完整的數據庫對象，用於在 renderNaturalPrescriptions 函數中查找自然處方詳情。
 */
function SymptomDetailCard({ symptomData, database }) {
  // 強化解構賦值：確保 symptomData 存在，如果不存在，則使用空對象。
  // 並為所有列表屬性提供空陣列作為預設值，避免對 undefined 調用 .map()。
  const { 
    name, // name 屬性也可能為 undefined
    possibleCauses = [], 
    homeCare = [], 
    whenToSeeADoctor = [], 
    naturalPrescriptions = [] 
  } = symptomData || {}; // 如果 symptomData 本身是 undefined 或 null，解構成空對象

  // 如果 symptomData 為空或 name 不存在，顯示提示
  if (!symptomData || !name) {
    return (
      <Card className="result-card">
        <Paragraph style={{ textAlign: 'center', color: 'red' }}>
          症狀數據載入失敗或數據不完整。
        </Paragraph>
      </Card>
    );
  }

  return (
    // 卡片容器，應用 ResultsView.css 中的 .result-card 樣式
    <Card className="result-card">
      {/* 症狀主標題，顯示症狀名稱和圖標。確保 name 存在才顯示 */}
      <Title level={2}>🤒&nbsp;{name}</Title>
      
      {/* 可能原因區塊，僅在 possibleCauses 陣列有內容時顯示 */}
      {possibleCauses.length > 0 && (
        <>
          <Title level={4}>可能原因：</Title>
          {/* 遍歷並顯示每個可能原因為列表項 */}
          <ul>{possibleCauses.map(cause => <li key={cause}>{cause}</li>)}</ul>
        </>
      )}
      
      {/* 居家照護區塊，僅在 homeCare 陣列有內容時顯示 */}
      {homeCare.length > 0 && (
        <>
          <Title level={4}>居家照護：</Title>
          {/* 遍歷並顯示每個居家照護建議為列表項 */}
          <ul>{homeCare.map(care => <li key={care}>{care}</li>)}</ul>
        </>
      )}
      
      {/* 何時就醫區塊，僅在 whenToSeeADoctor 陣列有內容時顯示 */}
      {whenToSeeADoctor.length > 0 && (
        <>
          <Title level={4}>何時就醫：</Title>
          {/* 遍歷並顯示每個就醫指引為列表項 */}
          <ul>{whenToSeeADoctor.map(when => <li key={when}>{when}</li>)}</ul>
        </>
      )}
      
      {/* 建議的自然處方區塊，僅在 naturalPrescriptions 陣列有內容時使用輔助函數渲染 */}
      {/* 傳遞症狀關聯的自然處方列表和完整數據庫以供查詢詳情 */}
      {naturalPrescriptions.length > 0 && renderNaturalPrescriptions(naturalPrescriptions, database)}
      
      {/* 免責聲明 */}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與您的醫師討論。
      </Paragraph>
    </Card>
  );
}

export default SymptomDetailCard;