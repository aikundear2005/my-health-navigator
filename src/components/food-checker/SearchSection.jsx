// src/components/food-checker/SearchSection.jsx

import React, { useState } from 'react';
import { AutoComplete, Tag, Input, Button } from 'antd'; // 導入 Input, Button
import { SearchOutlined } from '@ant-design/icons';
import './SearchSection.css';

const SearchSection = ({ allDrugs, onSelectDrug }) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');

    const handleSearch = (searchText) => {
        setValue(searchText);
        if (!searchText) {
            setOptions([]);
        } else {
            const filteredOptions = allDrugs
                .filter(drug => drug.name.toLowerCase().includes(searchText.toLowerCase()))
                .map(drug => ({
                    value: drug.name,
                    label: (
                        <div className="suggestion-item">
                            <span>{drug.name}</span>
                            <span className="suggestion-category">{drug.category}</span>
                        </div>
                    ),
                }));
            setOptions(filteredOptions);
        }
    };

    const handleSelect = (selectedValue) => {
        setValue(selectedValue);
        onSelectDrug(selectedValue);
    };
    
    const hotSearches = ["阿斯匹靈", "二甲雙胍", "抗凝血劑"];

    return (
        <div className="search-section">
            {/* 將 AutoComplete 和 Button 放在一個容器中，用 Flexbox 對齊 */}
            <div className="search-container">
                <AutoComplete
                    className="drug-search-autocomplete"
                    options={options}
                    onSelect={handleSelect}
                    onSearch={handleSearch}
                    value={value}
                    style={{ flex: 1 }} // 讓 AutoComplete 填滿剩餘空間
                >
                   <Input 
                        className="drug-search-input"
                        placeholder="搜尋藥物名稱或成分..."
                   />
                </AutoComplete>
                <Button 
                    className="search-btn" 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={() => onSelectDrug(value)}
                />
            </div>
            
            <div className="quick-access">
                <div className="quick-access-title">熱門查詢</div>
                <div className="quick-tags">
                    {hotSearches.map(term => (
                        <Tag key={term} className="quick-tag" onClick={() => onSelectDrug(term)}>{term}</Tag>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchSection;