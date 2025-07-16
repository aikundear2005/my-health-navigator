// src/App.js (最終修正版 - 移除舊的全域資料載入邏輯)

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Dropdown, Space } from 'antd'; // 引入 Space
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

// 自定義 Hook，用於偵測螢幕寬度（放置在組件外部）
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

// 查詢工具的下拉選單項目陣列 (Ant Design v5+ 推薦的 `items` 結構)
const queryMenuItems = [
  { key: 'search', icon: <SearchOutlined />, label: <Link to="/search">分類查詢</Link> },
  { key: 'food-checker', icon: <SafetyOutlined />, label: <Link to="/food-checker">飲食相容查詢</Link> },
];

// 主導覽列的項目陣列 (Ant Design v5+ 推薦的 `items` 結構)
const navItems = [
  { key: 'home', icon: <HomeOutlined />, label: <Link to="/">首頁</Link> },
  { 
    key: 'query-tools', 
    icon: <SearchOutlined />, 
    label: (
      <Dropdown menu={{ items: queryMenuItems }} trigger={['hover']}>
        <a onClick={e => e.preventDefault()} className="nav-dropdown-link">
          查詢工具 <MenuOutlined style={{ fontSize: '12px', verticalAlign: 'middle' }} />
        </a>
      </Dropdown>
    ),
  },
  { key: 'scenarios', icon: <CompassOutlined />, label: <Link to="/scenarios">情境專區</Link> },
];

function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [width] = useWindowSize();
  const isMobile = width < 768; // 定義手機尺寸斷點

  const location = useLocation();
  const getCurrentKey = () => {
    if (location.pathname.startsWith('/scenarios')) return 'scenarios';
    if (location.pathname.startsWith('/food-checker')) return 'query-tools';
    if (location.pathname.startsWith('/search')) return 'query-tools';
    return 'home';
  };
  
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // 手機版抽屜的導航項目
  const mobileNavItems = [
      { key: 'home', icon: <HomeOutlined />, label: <Link to="/" onClick={closeDrawer}>首頁</Link> },
      { key: 'search', icon: <SearchOutlined />, label: <Link to="/search" onClick={closeDrawer}>分類查詢</Link> },
      { key: 'food-checker', icon: <SafetyOutlined />, label: <Link to="/food-checker" onClick={closeDrawer}>飲食相容查詢</Link> },
      { key: 'scenarios', icon: <CompassOutlined />, label: <Link to="/scenarios" onClick={closeDrawer}>情境專區</Link> },
  ];

  // ====================================================================
  // *** 移除 initializeApp 及其內部對 /api/data 的請求 ***
  // 各個視圖組件現在會自己負責資料載入，App.js 不再進行全域資料初始化。
  // ====================================================================

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        <div className="logo">
          <Link to="/">My Health Navigator</Link>
        </div>
        
        {isMobile ? ( // 手機版
          <Button 
            type="primary" 
            icon={<MenuOutlined />} 
            onClick={showDrawer} 
            className="header-menu-button" // 新增一個 class 以便 CSS 控制
          />
        ) : ( // 電腦版
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getCurrentKey()]}
            items={navItems}
            className="header-menu-horizontal" // 新增一個 class 以便 CSS 控制
          />
        )}

        <Drawer
          title="導覽"
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[getCurrentKey()]}
            items={mobileNavItems}
          />
        </Drawer>

      </Header>
      <Content className="app-content">
        <Routes>
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
