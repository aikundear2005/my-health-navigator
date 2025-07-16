#!/bin/bash

# 腳本說明：自動創建項目所需的目錄和組件檔案，並填充初始程式碼

echo "開始創建項目結構和檔案..."

# --- 清理舊檔案和目錄 (確保是全新的開始) ---
echo "清理舊的 utils 和 components/details 目錄..."
rm -rf src/utils
rm -rf src/components/details
rm -f src/components/ResultsView.js # 刪除 ResultsView.js 準備重新生成

# --- 創建 utils 目錄和 helpers.js ---
echo "創建 src/utils/helpers.js..."
mkdir -p src/utils
cat << EOF > src/utils/helpers.js
// src/utils/helpers.js

import React from 'react';
import { Typography } from 'antd'; // 假設 Typography 來自 Ant Design

const { Title, Paragraph } = Typography;

/**
 * 輔助函數：將文本中的換行符 '\n' 替換為 '<br/>'，並安全地渲染 HTML 內容。
 * @param {string} text - 包含可能需要換行的文本字符串。
 * @returns {JSX.Element | null} 渲染後的 React 元素，如果文本為空則返回 null。
 */
export const renderTextWithLineBreaks = (text) => {
  if (typeof text !== 'string' || !text) {
    return null;
  }
  const htmlContent = text.replace(/\\n/g, '<br/>'); // 注意這裡的 \\n 是為了在 shell 中正確寫入 \n
  return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

/**
 * 輔助函數：渲染自然處方列表的詳細資訊。
 * 從數據庫中查找每個處方的詳細內容並格式化顯示。
 * @param {Array<string>} prescriptionsArray - 包含自然處方名稱的字符串數組。
 * @param {Object} database - 完整的數據庫對象，用於查找自然處方詳情。
 * @returns {JSX.Element | null} 渲染後的自然處方區塊，如果沒有處方則返回 null。
 */
export const renderNaturalPrescriptions = (prescriptionsArray, database) => {
  if (!prescriptionsArray || prescriptionsArray.length === 0) {
    return null;
  }

  const detailedPrescriptions = prescriptionsArray.map(name => {
    const prescriptionDetail = database.naturalPrescriptions[name];
    if (prescriptionDetail) {
      let detailParts = [];
      detailParts.push(\`\${prescriptionDetail.icon || ''} \${name}\`); // 使用模板字符串
      if (prescriptionDetail.importance) {
          detailParts.push(\`重要性: \${prescriptionDetail.importance}\`);
      }
      if (prescriptionDetail.prescription && prescriptionDetail.prescription.howLong) {
          detailParts.push(\`建議時長: \${prescriptionDetail.prescription.howLong}\`);
      }
      if (prescriptionDetail.timingAndPrecautions && prescriptionDetail.timingAndPrecautions.reminders) {
          detailParts.push(\`提醒: \${prescriptionDetail.timingAndPrecautions.reminders}\`);
      }
      return detailParts.join(' -- ');
    }
    return name;
  }).join('\\n'); // 使用 \\n 連接每個處方項目

  return (
    <>
      <Title level={4}>🧘‍♀️&nbsp;建議的自然處方</Title>
      <Paragraph>{renderTextWithLineBreaks(detailedPrescriptions)}</Paragraph>
    </>
  );
};
EOF
echo "已創建 src/utils/helpers.js"

# --- 創建 components/details 目錄和所有詳細組件檔案 ---
echo "創建 src/components/details 目錄..."
mkdir -p src/components/details

echo "創建並填充 src/components/details/DrugDetailCard.jsx..."
cat << EOF > src/components/details/DrugDetailCard.jsx
// src/components/details/DrugDetailCard.jsx

import React from 'react';
import { Typography, Card } from 'antd';
import { renderNaturalPrescriptions } from '../../utils/helpers';

const { Title, Paragraph, Text } = Typography;

/**
 * 藥物詳細資訊卡片組件。
 */
function DrugDetailCard({ drugData, database }) {
  return (
    <Card className="result-card">
      <Title level={2}>💊&nbsp;{drugData.name}</Title>
      {drugData.examples && drugData.examples.length > 0 && (
        <>
          <Title level={4}>藥物名稱範例：</Title>
          <ul>{drugData.examples.map(example => <li key={example}>{example}</li>)}</ul>
        </>
      )}
      <Title level={4}>可能導致的副作用/後遺症：</Title>
      <ul>{drugData.sideEffects.map(sideEffect => <li key={sideEffect}>{sideEffect}</li>)}</ul>
      {drugData.interactions && drugData.interactions.length > 0 && (
        <>
          <Title level={4}>⚠️&nbsp;重要藥物食物交互作用：</Title>
          <ul>{drugData.interactions.map(interaction => <li key={interaction}>{interaction}</li>)}</ul>
        </>
      )}
      <Title level={4}>藥物在代謝過程中可能流失的營養素包括：</Title>
      <Paragraph>{drugData.depletedNutrients ? drugData.depletedNutrients.join('、') : '無'}</Paragraph>
      <Title level={4}>🌿&nbsp;建議的營養補充與注意事項：</Title>
      <ul>{drugData.solutions.map(solution => <li key={solution}>{solution}</li>)}</ul>
      {renderNaturalPrescriptions(drugData.naturalPrescriptions, database)}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與您的醫師或藥師討論。
      </Paragraph>
    </Card>
  );
}

export default DrugDetailCard;
EOF
echo "已創建 src/components/details/DrugDetailCard.jsx"

echo "創建並填充 src/components/details/SymptomDetailCard.jsx..."
cat << EOF > src/components/details/SymptomDetailCard.jsx
// src/components/details/SymptomDetailCard.jsx

import React from 'react';
import { Typography, Card } from 'antd';
import { renderNaturalPrescriptions } from '../../utils/helpers';

const { Title, Paragraph } = Typography;

/**
 * 症狀詳細資訊卡片組件。
 */
function SymptomDetailCard({ symptomData, database }) {
  return (
    <Card className="result-card">
      <Title level={2}>🤒&nbsp;{symptomData.name}</Title>
      <Title level={4}>可能原因：</Title>
      <ul>{symptomData.possibleCauses.map(cause => <li key={cause}>{cause}</li>)}</ul>
      <Title level={4}>居家照護：</Title>
      <ul>{symptomData.homeCare.map(care => <li key={care}>{care}</li>)}</ul>
      <Title level={4}>何時就醫：</Title>
      <ul>{symptomData.whenToSeeADoctor.map(when => <li key={when}>{when}</li>)}</ul>
      {renderNaturalPrescriptions(symptomData.naturalPrescriptions, database)}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與您的醫師討論。
      </Paragraph>
    </Card>
  );
}

export default SymptomDetailCard;
EOF
echo "已創建 src/components/details/SymptomDetailCard.jsx"

echo "創建並填充 src/components/details/NutrientDetailCard.jsx..."
cat << EOF > src/components/details/NutrientDetailCard.jsx
// src/components/details/NutrientDetailCard.jsx

import React from 'react';
import { Typography, Card } from 'antd';
import { renderNaturalPrescriptions } from '../../utils/helpers';

const { Title, Paragraph } = Typography;

/**
 * 營養素詳細資訊卡片組件。
 */
function NutrientDetailCard({ nutrientData, database }) {
  return (
    <Card className="result-card">
      <Title level={2}>🧬&nbsp;{nutrientData.name}</Title>
      <Title level={4}>主要功能：</Title>
      <ul>{nutrientData.functions.map(func => <li key={func}>{func}</li>)}</ul>
      <Title level={4}>主要食物來源：</Title>
      <ul>{nutrientData.sources.map(source => <li key={source}>{source}</li>)}</ul>
      <Title level={4}>缺乏症狀：</Title>
      <ul>{nutrientData.deficiencySymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
      <Title level={4}>過量症狀：</Title>
      <ul>{nutrientData.overdoseSymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
      {renderNaturalPrescriptions(nutrientData.naturalPrescriptions, database)}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與您的醫師或營養師討論。
      </Paragraph>
    </Card>
  );
}

export default NutrientDetailCard;
EOF
echo "已創建 src/components/details/NutrientDetailCard.jsx"

echo "創建並填充 src/components/details/NaturalPrescriptionDetailCard.jsx..."
cat << EOF > src/components/details/NaturalPrescriptionDetailCard.jsx
// src/components/details/NaturalPrescriptionDetailCard.jsx

import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 自然處方詳細資訊卡片組件。
 */
function NaturalPrescriptionDetailCard({ prescriptionData }) {
  return (
    <Card className="result-card">
      <Title level={2}>{prescriptionData.icon || ''}&nbsp;{prescriptionData.name}</Title>
      <Title level={4}>重要性：</Title>
      <Paragraph>{prescriptionData.importance}</Paragraph>
      <Title level={4}>建議處方：</Title>
      <Paragraph>
        在哪裡: {prescriptionData.prescription.where.join('、')}<br/>
        多久: {prescriptionData.prescription.howLong}
      </Paragraph>
      <Title level={4}>時間與注意事項：</Title>
      <Paragraph>
        時間: {prescriptionData.timingAndPrecautions.timing}<br/>
        準備: {prescriptionData.timingAndPrecautions.preparation}<br/>
        提醒: {prescriptionData.timingAndPrecautions.reminders}
      </Paragraph>
      {prescriptionData.deficiencySymptoms && prescriptionData.deficiencySymptoms.length > 0 && (
        <>
          <Title level={4}>有助於改善以下症狀：</Title>
          <ul>{prescriptionData.deficiencySymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}</ul>
        </>
      )}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請諮詢專業人士。
      </Paragraph>
    </Card>
  );
}

export default NaturalPrescriptionDetailCard;
EOF
echo "已創建 src/components/details/NaturalPrescriptionDetailCard.jsx"

echo "創建並填充 src/components/details/LifestyleImpactDetailCard.jsx..."
cat << EOF > src/components/details/LifestyleImpactDetailCard.jsx
// src/components/details/LifestyleImpactDetailCard.jsx

import React from 'react';
import { Typography, Card } from 'antd';
import { renderNaturalPrescriptions } from '../../utils/helpers';

const { Title, Paragraph } = Typography;

/**
 * 生活習慣影響詳細資訊卡片組件。
 */
function LifestyleImpactDetailCard({ lifestyleImpactData, database }) {
  return (
    <Card className="result-card">
      <Title level={2}>{lifestyleImpactData.icon || ''}&nbsp;{lifestyleImpactData.name}</Title>
      <Title level={4}>影響概述：</Title>
      <Paragraph>{lifestyleImpactData.impactSummary}</Paragraph>
      {lifestyleImpactData.affectedNutrients && lifestyleImpactData.affectedNutrients.length > 0 && (
        <>
          <Title level={4}>可能受影響的營養素：</Title>
          <Paragraph>{lifestyleImpactData.affectedNutrients.join('、')}</Paragraph>
        </>
      )}
      {lifestyleImpactData.recommendedActions && lifestyleImpactData.recommendedActions.length > 0 && (
        <>
          <Title level={4}>建議的行動：</Title>
          <ul>{lifestyleImpactData.recommendedActions.map(action => <li key={action}>{action}</li>)}</ul>
        </>
      )}
      {lifestyleImpactData.potentialHealthIssues && lifestyleImpactData.potentialHealthIssues.length > 0 && (
        <>
          <Title level={4}>潛在的健康問題：</Title>
          <ul>{lifestyleImpactData.potentialHealthIssues.map(issue => <li key={issue}>{issue}</li>)}</ul>
        </>
      )}
      {renderNaturalPrescriptions(lifestyleImpactData.naturalPrescriptions, database)}
      <Paragraph style={{ fontSize: '0.8em', color: '#777', marginTop: '1em' }}>
        本資訊僅供參考，請與醫師、營養師或其他專業人士討論。
      </Paragraph>
    </Card>
  );
}

export default LifestyleImpactDetailCard;
EOF
echo "已創建 src/components/details/LifestyleImpactDetailCard.jsx"

# --- 重新生成 ResultsView.js (簡潔版本) ---
echo "重新生成 src/components/ResultsView.js..."
cat << EOF > src/components/ResultsView.js
// src/components/ResultsView.js

import React from 'react';
import { Button, Typography } from 'antd';
import './ResultsView.css';

// 引入所有新的詳細卡片組件
import DrugDetailCard from './details/DrugDetailCard.jsx';
import SymptomDetailCard from './details/SymptomDetailCard.jsx';
import NutrientDetailCard from './details/NutrientDetailCard.jsx';
import NaturalPrescriptionDetailCard from './details/NaturalPrescriptionDetailCard.jsx';
import LifestyleImpactDetailCard from './details/LifestyleImpactDetailCard.jsx';

const { Title } = Typography;

/**
 * ResultsView 組件：顯示使用者查詢結果的詳細信息。
 * 根據傳入的類型 (type)，動態渲染對應的詳細卡片組件。
 */
function ResultsView({ onNavigate, type, itemKey, database }) {
  console.log("ResultsView received type:", type);
  console.log("ResultsView received itemKey:", itemKey);
  console.log("ResultsView received database:", database);

  let contentComponent = null;
  let selectedItemData = null;

  let dataKey = type;
  if (type === 'drug') {
      dataKey = 'drugs';
  } else if (type === 'symptom') {
      dataKey = 'symptoms';
  } else if (type === 'nutrient') {
      dataKey = 'nutrients';
  } else if (type === 'naturalPrescription') {
      dataKey = 'naturalPrescriptions';
  } else if (type === 'lifestyleImpact') {
      dataKey = 'lifestyleImpacts';
  }

  if (!database || !database[dataKey] || !database[dataKey][itemKey]) {
    contentComponent = <p>找不到相關資訊。</p>;
  } else {
    selectedItemData = database[dataKey][itemKey];

    switch (type) {
      case 'drug':
        contentComponent = <DrugDetailCard drugData={selectedItemData} database={database} />;
        break;
      case 'symptom':
        contentComponent = <SymptomDetailCard symptomData={selectedItemData} database={database} />;
        break;
      case 'nutrient':
        contentComponent = <NutrientDetailCard nutrientData={selectedItemData} database={database} />;
        break;
      case 'naturalPrescription':
        contentComponent = <NaturalPrescriptionDetailCard prescriptionData={selectedItemData} />;
        break;
      case 'lifestyleImpact':
        contentComponent = <LifestyleImpactDetailCard lifestyleImpactData={selectedItemData} database={database} />;
        break;
      default:
        contentComponent = <p>不支援的查詢類型。</p>;
        break;
    }
  }


  return (
    <div className="container">
      <Button
        className="back-button"
        onClick={() => {
          if (type === 'naturalPrescription') {
            onNavigate('search', 'naturalPrescriptions');
          } else if (type === 'lifestyleImpact') {
            onNavigate('search', 'lifestyleImpacts');
          } else {
            onNavigate('search', type);
          }
        }}
      >
        ← 返回查詢列表
      </Button>
      <Button
        className="back-button"
        style={{ marginLeft: '10px' }}
        onClick={() => onNavigate('home')}
      >
        ← 返回首頁
      </Button>

      <Title level={1}>查詢結果</Title>
      {contentComponent}
    </div>
  );
}

export default ResultsView;
EOF
echo "已創建 src/components/ResultsView.js"

echo "所有指定目錄和檔案已創建並填充內容。"