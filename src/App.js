// src/App.js

import React from 'react';
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
import './App.css';

const { Header, Content, Footer } = Layout;

// 導航項目數據
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

// ... (useWindowSize Hook 維持不變)

function App() {
  // 不再需要 isLoading, error, database 等全域狀態
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  // ... (useWindowSize, isMobile 等邏輯維持不變)

  const location = useLocation();
  const getCurrentKey = () => {
    if (location.pathname.startsWith('/scenarios')) return 'scenarios';
    if (location.pathname.startsWith('/food-checker')) return 'query-tools';
    if (location.pathname.startsWith('/search')) return 'query-tools';
    return 'home';
  };
  
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // ... (mobileNavItems 邏輯維持不變)

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        {/* ... (Header 內容維持不變) */}
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
