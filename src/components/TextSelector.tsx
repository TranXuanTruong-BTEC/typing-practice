'use client';

import React, { useState, useMemo } from 'react';
import { TypingText, typingTexts, getTextsByCategory, getTextsByDifficulty, getTextsByLanguage } from '@/data/typing-texts';
import { getDifficultyColor } from '@/lib/typing-utils';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Globe, Zap } from 'lucide-react';

interface TextSelectorProps {
  onSelectText: (text: TypingText) => void;
  selectedText: TypingText | null;
}

export default function TextSelector({ onSelectText, selectedText }: TextSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = [...new Set(typingTexts.map(text => text.category))];
    return cats;
  }, []);

  const filteredTexts = useMemo(() => {
    let filtered = typingTexts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(text => 
        text.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(text => text.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(text => text.difficulty === selectedDifficulty);
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(text => text.language === selectedLanguage);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedLanguage]);

  const handleTextSelect = (text: TypingText) => {
    onSelectText(text);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Luyện gõ phím</h1>
        <p className="text-gray-600">Chọn bài luyện tập phù hợp với trình độ của bạn</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài luyện tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-blue-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="inline w-4 h-4 mr-1" />
              Độ khó
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
            >
              <option value="all">Tất cả độ khó</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline w-4 h-4 mr-1" />
              Ngôn ngữ
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700 font-semibold"
            >
              <option value="all">Tất cả ngôn ngữ</option>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold">{filteredTexts.length}</span> bài luyện tập
        </p>
      </div>

      {/* Text List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTexts.map((text, index) => (
          <motion.div
            key={text.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleTextSelect(text)}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
              selectedText?.id === text.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{text.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(text.difficulty)}`}>
                  {text.difficulty === 'easy' ? 'Dễ' : text.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                  {text.category}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                  {text.language === 'vi' ? 'Tiếng Việt' : 'English'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {text.text.substring(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{text.text.length} ký tự</span>
              <span>{text.text.split(' ').length} từ</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredTexts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy bài luyện tập</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
} 