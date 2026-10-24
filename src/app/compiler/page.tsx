'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import CodeEditor from '../../components/CodeEditor';
import StdinPanel from '../../components/StdinPanel';
import TerminalOutput from '../../components/TerminalOutput';
import UploadModal from '../../components/UploadModal';
import PracticalDetailModal from '../../components/PracticalDetailModal';
import { PRACTICALS, DEFAULT_C_STARTER, DEFAULT_CPP_STARTER } from '../../data/practicals';
import { SupportedLanguage, ExecutionResponse, Practical, CustomRunnerConfig } from '../../types';
import { AlertCircle, Info, Sparkles } from 'lucide-react';

function CompilerContent() {
  const searchParams = useSearchParams();
  const practicalParam = searchParams.get('practical');
  const sourceParam = searchParams.get('source');

  const [language, setLanguage] = useState<SupportedLanguage>('c');
  const [code, setCode] = useState<string>(DEFAULT_C_STARTER);
  const [stdin, setStdin] = useState<string>('');
  const [activePractical, setActivePractical] = useState<Practical | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResponse | null>(null);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load practical by ID
  const loadPracticalById = useCallback((id: string) => {
    const p = PRACTICALS.find((item) => item.id === id);
    if (p) {
      setActivePractical(p);
      setCode(p.sourceCode);
      setLanguage(p.language);
      setStdin(p.sampleInput);
      setResult(null);
      setApiErrorBanner(null);
    }
  }, []);

  // Listen to custom event from "Practicals ▼" navbar dropdown
  useEffect(() => {
    const handlePracticalEvent = (e: Event) => {
      const customEv = e as CustomEvent<string>;
      if (customEv.detail) {
        loadPracticalById(customEv.detail);
      }
    };

    window.addEventListener('aoa:load-practical', handlePracticalEvent);
    return () => {
      window.removeEventListener('aoa:load-practical', handlePracticalEvent);
    };
  }, [loadPracticalById]);

  // Initial load from URL searchParams or upload
  useEffect(() => {
    if (practicalParam) {
      loadPracticalById(practicalParam);
    } else if (sourceParam === 'upload') {
      const savedCode = localStorage.getItem('aoa_custom_code');
      const savedLang = localStorage.getItem('aoa_custom_lang') as SupportedLanguage;
      if (savedCode) {
        setCode(savedCode);
        if (savedLang) setLanguage(savedLang);
        setActivePractical(null);
      }
    } else {
      // Default initial practical: Experiment 1.1 Insertion Sort
      loadPracticalById('insertion-sort');
    }
  }, [practicalParam, sourceParam, loadPracticalById]);

  // Handle language change
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    if (!activePractical) {
      if (newLang === 'cpp' && code === DEFAULT_C_STARTER) {
        setCode(DEFAULT_CPP_STARTER);
      } else if (newLang === 'c' && code === DEFAULT_CPP_STARTER) {
        setCode(DEFAULT_C_STARTER);
      }
    }
  };

  // Reset code
  const handleReset = () => {
    if (activePractical) {
      setCode(activePractical.sourceCode);
      setStdin(activePractical.sampleInput);
    } else {
      setCode(language === 'cpp' ? DEFAULT_CPP_STARTER : DEFAULT_C_STARTER);
      setStdin('');
    }
    setResult(null);
  };

  // Handle file loaded via upload
  const handleCodeLoaded = (uploadedCode: string, uploadedLang: SupportedLanguage) => {
    setCode(uploadedCode);
    setLanguage(uploadedLang);
    setActivePractical(null);
    setResult(null);
  };

  // Run code against /api/execute
  const handleRun = async () => {
    if (!code.trim()) {
      alert('Code editor cannot be empty.');
      return;
    }

    setIsLoading(true);
    setApiErrorBanner(null);

    // Language ID for Judge0 (50 = C GCC 9.2.0, 54 = C++ GCC 9.2.0)
    const languageId = language === 'cpp' ? 54 : 50;

    const customHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    try {
      const savedRunner = localStorage.getItem('aoa_runner_config');
      if (savedRunner) {
        const parsed: CustomRunnerConfig = JSON.parse(savedRunner);
        if (parsed.apiUrl) customHeaders['x-judge0-url'] = parsed.apiUrl;
        if (parsed.apiKey) customHeaders['x-judge0-key'] = parsed.apiKey;
        if (parsed.apiHost) customHeaders['x-judge0-host'] = parsed.apiHost;
        if (parsed.authToken) customHeaders['x-judge0-token'] = parsed.authToken;
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setApiErrorBanner(
          data.error ||
            'Code execution service error. If you are offline or reaching rate limits, configure custom Judge0 API keys in settings.'
        );
      }

      setResult({
        stdout: data.stdout,
        stderr: data.stderr,
        compile_output: data.compile_output,
        message: data.message,
        time: data.time,
        memory: data.memory,
        status: data.status || { id: res.ok ? 3 : 13, description: res.statusText },
        engine: data.engine
      });
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Network error connecting to compiler backend.';
      setApiErrorBanner(errMsg);
      setResult({
        status: { id: 13, description: 'Network Failure' },
        stderr: errMsg,
        stdout: null,
        compile_output: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 lg:p-5 flex flex-col gap-3">
        {/* Compact status pill for currently loaded practical (keeps titles hidden by default, only shows current) */}
        {activePractical && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono font-bold text-[11px] border border-blue-500/20">
                {activePractical.expNumber}
              </span>
              <span className="font-semibold text-zinc-200">{activePractical.title}</span>
              <span className="hidden md:inline-block text-zinc-500 font-mono text-[11px]">
                ({activePractical.paradigm})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {activePractical.timeComplexity.average}
              </span>
              <button
                onClick={() => setIsDetailOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
                title="View Algorithm & Aim"
              >
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Theory / Aim</span>
              </button>
            </div>
          </div>
        )}

        {/* API Error Notification */}
        {apiErrorBanner && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-rose-200">Execution Notice:</span>
              <p>{apiErrorBanner}</p>
            </div>
          </div>
        )}

        {/* Compiler Main Split Layout: Code Editor on Left, Stdin + Terminal on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[640px]">
          {/* Main Focus: Code Editor (7 cols on lg, full width on mobile) */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[460px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRun}
              onReset={handleReset}
              isLoading={isLoading}
              onUploadClick={() => setIsUploadOpen(true)}
              activePracticalTitle={
                activePractical
                  ? `${activePractical.expNumber}: ${activePractical.title}`
                  : undefined
              }
            />
          </div>

          {/* Right Column: Stdin + Terminal Output (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 h-full">
            {/* Standard Input Panel */}
            <div className="shrink-0">
              <StdinPanel
                stdin={stdin}
                onChange={setStdin}
                sampleInput={activePractical?.sampleInput}
                onLoadSample={() => {
                  if (activePractical) {
                    setStdin(activePractical.sampleInput);
                  }
                }}
              />
            </div>

            {/* Terminal Output Panel */}
            <div className="flex-1 min-h-[300px]">
              <TerminalOutput
                result={result}
                isLoading={isLoading}
                onClear={() => setResult(null)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCodeLoaded={handleCodeLoaded}
      />

      {/* Practical Detail Modal (accessible via "Theory / Aim" button) */}
      <PracticalDetailModal
        practical={activePractical}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

export default function CompilerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 font-mono text-sm">
          Loading Compiler...
        </div>
      }
    >
      <CompilerContent />
    </Suspense>
  );
}
