// src/App.js

import React, { useState, useEffect } from 'react'; // 確保導入 useState 和 useEffect
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Dropdown } from 'antd';
import { MenuOutlined, SearchOutlined, SafetyOutlined, CompassOutlined, HomeOutlined } from '@ant-design/icons';

// 導入所有視圖
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ResultsView from './views/ResultsView';
import ScenariosView from './views/ScenariosView';
import ScenarioDetailView from './views/ScenarioDetailView';
import FoodCheckerView from './views/FoodCheckerView';
import './App.css'; // 確保 App.css 被導入

const { Header, Content, Footer } = Layout;

// 自定義 Hook，用於偵測螢幕寬度（這個 Hook 必須放在 App 組件外部）
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    // 清理函數：組件卸載時移除事件監聽
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空依賴項陣列表示只在組件掛載和卸載時執行一次
  return size;
};

// 導航項目數據 (Ant Design v5+ 推薦的 `items` 結構)
const queryMenuItems = [
  { key: 'search', icon: <SearchOutlined />, label: <Link to="/search">分類查詢</Link> },
  { key: 'food-checker', icon: <SafetyOutlined />, label: <Link to="/food-checker">飲食相容查詢</Link> },
];

const navItems = [
  { key: 'home', icon: <HomeOutlined />, label: <Link to="/">首頁</Link> },
  { key: 'query-tools', icon: <SearchOutlined />, label: (
      <Dropdown menu={{ items: queryMenuItems }} trigger={['hover']}>
        <span className="nav-dropdown-link">查詢工具</span>
      </Dropdown>
    )
  },
  { key: 'scenarios', icon: <CompassOutlined />, label: <Link to="/scenarios">情境專區</Link> },
];

function App() {
  // 不再需要 isLoading, error, database 等全域狀態
  const [drawerVisible, setDrawerVisible] = useState(false); // 使用 useState
  const [width] = useWindowSize(); // 獲取當前視窗寬度
  const isMobile = width < 768; // 判斷是否為手機尺寸 (小於 768px)

  const location = useLocation();
  const getCurrentKey = () => {
    // 根據當前路由判斷選中的菜單項
    if (location.pathname.startsWith('/scenarios')) return 'scenarios';
    if (location.pathname.startsWith('/food-checker')) return 'query-tools'; // 如果是飲食相容查詢，父級是 query-tools
    if (location.pathname.startsWith('/search')) return 'query-tools'; // 如果是分類查詢，父級是 query-tools
    return 'home';
  };
  
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // 手機版抽屜的導航項目
  const mobileNavItems = [
      { key: 'home', icon: <HomeOutlined />, label: <div onClick={closeDrawer}><Link to="/">首頁</Link></div> },
      { key: 'search', icon: <SearchOutlined />, label: <div onClick={closeDrawer}><Link to="/search">分類查詢</Link></div> },
      { key: 'food-checker', icon: <SafetyOutlined />, label: <div onClick={closeDrawer}><Link to="/food-checker">飲食相容查詢</Link></div> },
      { key: 'scenarios', icon: <CompassOutlined />, label: <div onClick={closeDrawer}><Link to="/scenarios">情境專區</Link></div> },
  ];

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        <div className="logo">
          <Link to="/">My Health Navigator</Link>
        </div>
        {isMobile ? ( // 如果是手機尺寸 (isMobile 為 true)，顯示漢堡按鈕和抽屜
          <>
            <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} />
            <Drawer
              title="導覽"
              placement="right"
              onClose={closeDrawer}
              open={drawerVisible}
              styles={{ body: { padding: 0 } }} // 確保抽屜內容無內邊距
            >
              <Menu
                theme="light"
                mode="inline" // 內聯模式適合抽屜菜單
                selectedKeys={[getCurrentKey()]}
                items={mobileNavItems} // Ant Design v5+ 推薦的 `items` 結構
              />
            </Drawer>
          </>
        ) : ( // 否則 (isMobile 為 false)，顯示水平菜單
          <Menu
            theme="dark"
            mode="horizontal" // 水平模式適合桌面導覽列
            selectedKeys={[getCurrentKey()]}
            items={navItems} // Ant Design v5+ 推薦的 `items` 結構
            style={{ flex: 1, justifyContent: 'flex-end' }} // 讓菜單靠右對齊
          />
        )}
      </Header>
      <Content className="app-content">
        <Routes>
          {/* 移除傳遞 database prop */}
          <Route path="/" element={<HomeView />} />
          <Route path="/search" element={<SearchView />} /> 
          <Route path="/results/:type/:itemKey" element={<ResultsView />} />
          <Route path="/scenarios" element={<ScenariosView />} />
          <Route path="/scenarios/:scenarioId" element={<ScenarioDetailView />} />
          <Route path="/food-checker" element={<FoodCheckerView />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        My Health Navigator ©2025 Created by You and Gemini
      </Footer>
    </Layout>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
