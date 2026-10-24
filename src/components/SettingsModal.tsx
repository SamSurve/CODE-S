'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, Check, Server, Key, AlertTriangle, RotateCcw } from 'lucide-react';
import { CustomRunnerConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [config, setConfig] = useState<CustomRunnerConfig>({
    apiUrl: 'https://ce.judge0.com',
    apiKey: '',
    apiHost: 'judge0-ce.p.rapidapi.com',
    authToken: ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aoa_runner_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('aoa_runner_config', JSON.stringify(config));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    const defaultConfig: CustomRunnerConfig = {
      apiUrl: 'https://ce.judge0.com',
      apiKey: '',
      apiHost: 'judge0-ce.p.rapidapi.com',
      authToken: ''
    };
    setConfig(defaultConfig);
    localStorage.removeItem('aoa_runner_config');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Execution Engine Settings</h2>
              <p className="text-xs text-zinc-400">Configure sandboxed execution API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-300 text-xs leading-relaxed flex gap-2.5">
            <Server className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
            <div>
              <span className="font-semibold text-blue-200">Default Sandbox:</span> By default, this app connects through the server to the public sandboxed compiler engine endpoint. You can specify a custom self-hosted or RapidAPI endpoint below.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Compiler API URL
              </label>
              <input
                type="text"
                value={config.apiUrl || ''}
                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                placeholder="https://ce.judge0.com"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Public CE: <code className="text-zinc-400">https://ce.judge0.com</code> or RapidAPI: <code className="text-zinc-400">https://judge0-ce.p.rapidapi.com</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                RapidAPI Key (Optional)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Leave empty if using public instance"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
                />
                <Key className="w-4 h-4 absolute right-3 top-3 text-zinc-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                RapidAPI Host (If using RapidAPI)
              </label>
              <input
                type="text"
                value={config.apiHost || ''}
                onChange={(e) => setConfig({ ...config, apiHost: e.target.value })}
                placeholder="judge0-ce.p.rapidapi.com"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Auth Token (For self-hosted instances)
              </label>
              <input
                type="password"
                value={config.authToken || ''}
                onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
                placeholder="X-Auth-Token (optional)"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 text-xs text-amber-300/80 bg-amber-950/20 border border-amber-800/30 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Settings saved here stay in your browser and are passed via server headers for execution.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
