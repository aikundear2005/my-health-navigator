// src/views/ResultsView.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// 確保所有詳情卡片的導入路徑正確
import DrugDetailCard from '../components/details/DrugDetailCard';
import SymptomDetailCard from '../components/details/SymptomDetailCard';
import NutrientDetailCard from '../components/details/NutrientDetailCard';
import NaturalPrescriptionDetailCard from '../components/details/NaturalPrescriptionDetailCard';
import LifestyleImpactDetailCard from '../components/details/LifestyleImpactDetailCard';

const { Title, Paragraph } = Typography;

function ResultsView() {
  const { type, itemKey } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!type || !itemKey) {
        setError('無效的查詢路徑。');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/${type}/${itemKey}`);
        if (!response.ok) {
          throw new Error(`找不到資料 (狀態碼: ${response.status})`);
        }
        const data = await response.json();
        setItemData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, itemKey]);

  // --- 修正：將 Spin 組件改為 fullscreen 模式 ---
  if (isLoading) {
    return <Spin fullscreen tip="正在獲取詳細資料..." />;
  }

  if (error) {
    return (
        <Card>
            <Paragraph style={{ textAlign: 'center', color: 'red' }}>
                資料載入失敗：{error}
            </Paragraph>
        </Card>
    );
  }

  const renderDetailCard = () => {
    if (!itemData) {
      return (
        <Card>
          <Paragraph style={{ textAlign: 'center', color: 'red' }}>
            找不到對應的資料：「{itemKey ? decodeURIComponent(itemKey) : "未知項目"}」。請返回並重試。
          </Paragraph>
        </Card>
      );
    }

    const componentMapping = {
      drug: <DrugDetailCard drugData={itemData} />,
      symptom: <SymptomDetailCard symptomData={itemData} />,
      nutrient: <NutrientDetailCard nutrientData={itemData} />,
      naturalPrescription: <NaturalPrescriptionDetailCard prescriptionData={itemData} />,
      lifestyleImpact: <LifestyleImpactDetailCard impactData={itemData} />,
    };

    return componentMapping[type] || (
      <Card>
        <Paragraph style={{ textAlign: 'center', color: 'red' }}>
          未知的資料類型：「{type}」。
        </Paragraph>
      </Card>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginRight: '16px' }}
        >
          返回上一頁
        </Button>
        <Button onClick={() => navigate('/')}>
          返回首頁
        </Button>
      </div>
      <Title level={2}>查詢結果</Title>
      {renderDetailCard()}
    </div>
  );
}

export default ResultsView;
