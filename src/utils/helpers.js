// src/utils/helpers.js

import React from 'react';
// 從 Ant Design 引入 Typography 組件，用於在渲染自然處方時使用 Title 和 Paragraph
import { Typography } from 'antd'; 

// 解構 Typography 的 Title 和 Paragraph 組件，方便使用
const { Title, Paragraph } = Typography;

/**
 * @function renderTextWithLineBreaks
 * @description 輔助函數：將文本中的換行符 `\n` 替換為 HTML 的 `<br/>` 標籤，並安全地渲染為 HTML 內容。
 * 這用於在 React 中顯示包含多行文本的字符串，而不會將 `\n` 顯示為普通文字。
 * @param {string} text - 包含可能需要換行的文本字符串。
 * @returns {JSX.Element | null} 渲染後的 React 元素。如果輸入的文本為空、null 或不是字符串，則返回 null。
 */
export const renderTextWithLineBreaks = (text) => {
  if (typeof text !== 'string' || !text) {
    return null;
  }
  // 將所有換行符 `\n` 替換為 `<br/>` 標籤
  const htmlContent = text.replace(/\n/g, '<br/>');
  // 使用 dangerouslySetInnerHTML 渲染包含 HTML 標籤的字符串。
  // 注意：使用此屬性應確保內容來源可信，以防止 XSS 攻擊。
  return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

/**
 * @function renderNaturalPrescriptions
 * @description 輔助函數：渲染自然處方列表的詳細資訊。
 * 該函數會遍歷自然處方名稱數組，從完整的數據庫中查找每個處方的詳細內容，
 * 並將其格式化為易於閱讀的字符串，最終渲染為一個包含多行的處方區塊。
 * @param {Array<string>} prescriptionsArray - 包含自然處方名稱的字符串數組（例如：['規律散步', '充足睡眠']）。
 * @param {Object} database - 完整的數據庫對象，用於查找自然處方詳情（`database.naturalPrescriptions`）。
 * @returns {JSX.Element | null} 渲染後的自然處方區塊。如果傳入的處方數組為空或不存在，則返回 null。
 */
export const renderNaturalPrescriptions = (prescriptionsArray, database) => {
  // 如果處方數組不存在或為空，則不渲染任何內容
  if (!prescriptionsArray || prescriptionsArray.length === 0) {
    return null;
  }

  // 遍歷處方名稱數組，為每個處方生成詳細的顯示文本
  const detailedPrescriptions = prescriptionsArray.map(name => {
    // 從數據庫的 naturalPrescriptions 部分查找該處方的詳細數據
    const prescriptionDetail = database.naturalPrescriptions[name];
    if (prescriptionDetail) {
      let detailParts = [];
      // 添加圖標和名稱
      detailParts.push(`${prescriptionDetail.icon || ''} ${name}`);
      // 如果存在重要性說明，則添加
      if (prescriptionDetail.importance) {
          detailParts.push(`重要性: ${prescriptionDetail.importance}`);
      }
      // 如果存在建議時長，則添加
      if (prescriptionDetail.prescription && prescriptionDetail.prescription.howLong) {
          detailParts.push(`建議時長: ${prescriptionDetail.prescription.howLong}`);
      }
      if (prescriptionDetail.timingAndPrecautions && prescriptionDetail.timingAndPrecautions.reminders) {
          detailParts.push(`提醒: ${prescriptionDetail.timingAndPrecautions.reminders}`);
      }
      // 將處方的各個部分用 ' -- ' 連接起來
      return detailParts.join(' -- ');
    }
    // 如果數據庫中找不到該處方名稱的詳細資訊，則只顯示名稱
    return name;
  }).join('\n'); // 將每個處方生成的詳細文本用換行符 `\n` 連接，以便後續正確渲染換行

  return (
    <>
      {/* 自然處方區塊的標題 */}
      <Title level={4}>🧘‍♀️&nbsp;建議的自然處方</Title>
      {/* 使用 renderTextWithLineBreaks 函數渲染包含換行符的詳細處方文本 */}
      <Paragraph>{renderTextWithLineBreaks(detailedPrescriptions)}</Paragraph>
    </>
  );
};