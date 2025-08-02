'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Palette, Volume2, Monitor } from 'lucide-react';
import { useTheme } from '../_contexts/ThemeContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { currentTheme, switchTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState('theme');

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'display', label: 'Display', icon: Monitor },
  ];

  const themePreviewColors = {
    'neo-green': ['#86efac', '#22c55e', '#166534'],
    'ocean-blue': ['#7dd3fc', '#0ea5e9', '#0c4a6e'],
    'sunset-orange': ['#fdba74', '#f97316', '#9a3412'],
    'purple-night': ['#d8b4fe', '#a855f7', '#581c87'],
    'minimalistic': ['#e2e8f0', '#94a3b8', '#1e293b'],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-4xl max-h-full bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[var(--shadow-glass)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-[var(--text-primary)]" />
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[var(--bg-glass)] hover:bg-[var(--bg-glass-strong)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-[calc(100%-88px)]">
                {/* Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${activeTab === tab.id
                              ? 'bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {activeTab === 'theme' && (
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Choose Theme</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(themes).map(([key, theme]) => (
                          <motion.div
                            key={key}
                            className={`
                              relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300
                              ${currentTheme === key
                                ? 'border-[var(--accent-400)] bg-[var(--bg-glass-strong)] shadow-[var(--shadow-glow)]'
                                : 'border-white/10 bg-[var(--bg-glass)] hover:border-white/20 hover:bg-[var(--bg-glass-strong)]'
                              }
                            `}
                            onClick={() => switchTheme(key)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Theme Preview */}
                            <div className="flex space-x-2 mb-3">
                              {themePreviewColors[key].map((color, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            
                            <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                              {theme.name}
                            </h4>
                            
                            {currentTheme === key && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-6 h-6 bg-[var(--gradient-accent)] rounded-full flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'audio' && (
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Audio Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                            Master Volume
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="80"
                            className="w-full h-2 bg-[var(--bg-glass)] rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                            Sound Effects
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="60"
                            className="w-full h-2 bg-[var(--bg-glass)] rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-primary)] font-medium">Background Music</span>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--gradient-primary)] transition-colors">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'display' && (
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Display Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2">
                            UI Scale
                          </label>
                          <select className="w-full px-4 py-3 bg-[var(--bg-glass)] border border-white/20 rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-400)]">
                            <option value="small">Small (90%)</option>
                            <option value="normal" selected>Normal (100%)</option>
                            <option value="large">Large (110%)</option>
                            <option value="xl">Extra Large (125%)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-primary)] font-medium">Reduce Motion</span>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--bg-glass)] transition-colors">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-primary)] font-medium">High Contrast</span>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--bg-glass)] transition-colors">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;