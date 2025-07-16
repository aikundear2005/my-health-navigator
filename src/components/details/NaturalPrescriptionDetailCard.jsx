// src/components/details/NaturalPrescriptionDetailCard.jsx

import React from 'react';
// 從 Ant Design 引入 Typography (用於標題和段落) 和 Card (用於內容卡片)
import { Typography, Card } from 'antd'; // 確保正確引入 Card 組件

// 解構 Typography 的 Title 和 Paragraph 組件，方便使用
const { Title, Paragraph } = Typography;

/**
 * @function NaturalPrescriptionDetailCard
 * @description 自然處方詳細資訊卡片組件。
 * 負責顯示單一自然處方本身的詳細信息，如其重要性、具體的處方內容（在哪裡做、多久），
 * 以及執行時間和注意事項，並可能包含其有助於改善的症狀。
 * 此組件不依賴完整的 database prop，因為其所有所需數據都已包含在 prescriptionData 中。
 * @param {Object} props - 組件屬性。
 * @param {Object} props.prescriptionData - 自然處方的詳細數據對象，包含所有相關資訊。
 */
function NaturalPrescriptionDetailCard({ prescriptionData }) {
  return (
    // 卡片容器，應用 ResultsView.css 中的 .result-card 樣式
    <Card className="result-card">
      {/* 自然處方主標題，顯示圖標和處方名稱 */}
      <Title level={2}>{prescriptionData.icon || ''}&nbsp;{prescriptionData.name}</Title>
      
      {/* 重要性區塊 */}
      <Title level={4}>重要性：</Title>
      <Paragraph>{prescriptionData.importance}</Paragraph>
      
      {/* 建議處方區塊 */}
      <Title level={4}>建議處方：</Title>
      <Paragraph>
        在哪裡: {prescriptionData.prescription.where.join('、')}<br/> {/* 顯示地點，並用頓號連接多個地點 */}
        多久: {prescriptionData.prescription.howLong} {/* 顯示建議時長 */}
      </Paragraph>
      
      {/* 時間與注意事項區塊 */}
      <Title level={4}>時間與注意事項：</Title>
      <Paragraph>
        時間: {prescriptionData.timingAndPrecautions.timing}<br/> {/* 顯示建議時間 */}
        準備: {prescriptionData.timingAndPrecautions.preparation}<br/> {/* 顯示準備事項 */}
        提醒: {prescriptionData.timingAndPrecautions.reminders} {/* 顯示提醒事項 */}
      </Paragraph>
      
      {/* 有助於改善症狀區塊，僅在 deficiencySymptoms 存在且不為空時顯示 */}
      {prescriptionData.deficiencySymptoms && prescriptionData.deficiencySymptoms.length > 0 && (
        <>
          <Title level={4}>有助於改善以下症狀：</Title>
          {/* 遍歷並顯示每個症狀為列表項 */}
          <ul>{prescriptionData.deficiencySymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
        </>
      )}
      
      {/* 免責聲明 */}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請諮詢專業人士。
      </Paragraph>
    </Card>
  );
}

export default NaturalPrescriptionDetailCard;