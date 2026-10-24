'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import CodeEditor from '../../components/CodeEditor';
import StdinPanel from '../../components/StdinPanel';
import TerminalOutput from '../../components/TerminalOutput';
import UploadModal from '../../components/UploadModal';
import { PRACTICALS, DEFAULT_C_STARTER, DEFAULT_CPP_STARTER } from '../../data/practicals';
import { SupportedLanguage, ExecutionResponse, Practical, CustomRunnerConfig } from '../../types';
import { Sparkles, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function CompilerContent() {
  const searchParams = useSearchParams();
  const practicalParam = searchParams.get('practical');
  const sourceParam = searchParams.get('source');

  const [language, setLanguage] = useState<SupportedLanguage>('c');
  const [code, setCode] = useState<string>(DEFAULT_C_STARTER);
  const [stdin, setStdin] = useState<string>('');
  const [selectedPracticalId, setSelectedPracticalId] = useState<string>('');
  const [activePractical, setActivePractical] = useState<Practical | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResponse | null>(null);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Load practical or uploaded code
  const loadPracticalById = useCallback((id: string) => {
    const p = PRACTICALS.find((item) => item.id === id);
    if (p) {
      setActivePractical(p);
      setSelectedPracticalId(p.id);
      setCode(p.sourceCode);
      setLanguage(p.language);
      setStdin(p.sampleInput);
      setResult(null);
    }
  }, []);

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
        setSelectedPracticalId('');
      }
    } else {
      // Default initial practical: Insertion Sort
      loadPracticalById('insertion-sort');
    }
  }, [practicalParam, sourceParam, loadPracticalById]);

  // Handle language switch
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    // If switching between default starter templates and no practical is active
    if (!activePractical) {
      if (newLang === 'cpp' && code === DEFAULT_C_STARTER) {
        setCode(DEFAULT_CPP_STARTER);
      } else if (newLang === 'c' && code === DEFAULT_CPP_STARTER) {
        setCode(DEFAULT_C_STARTER);
      }
    }
  };

  // Handle practical selection dropdown
  const handleSelectPractical = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) {
      setActivePractical(null);
      setSelectedPracticalId('');
      setCode(language === 'cpp' ? DEFAULT_CPP_STARTER : DEFAULT_C_STARTER);
      setStdin('');
      setResult(null);
      return;
    }
    loadPracticalById(id);
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

  // Handle code upload directly in compiler
  const handleCodeLoaded = (uploadedCode: string, uploadedLang: SupportedLanguage, filename: string) => {
    setCode(uploadedCode);
    setLanguage(uploadedLang);
    setActivePractical(null);
    setSelectedPracticalId('');
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

    // Language ID for Judge0:
    // 50: C (GCC 9.2.0)
    // 54: C++ (GCC 9.2.0)
    const languageId = language === 'cpp' ? 54 : 50;

    // Get any custom runner config from localStorage
    let customHeaders: Record<string, string> = {
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">
        {/* Top Control Bar: Practical Switcher & Quick Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-zinc-300">AOA Practical:</span>
            </div>

            <select
              value={selectedPracticalId}
              onChange={handleSelectPractical}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-100 font-medium focus:outline-none focus:border-blue-500 cursor-pointer min-w-[260px]"
            >
              <option value="">-- Blank / Custom Code --</option>
              {PRACTICALS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.expNumber}: {p.title} ({p.paradigm})
                </option>
              ))}
            </select>

            {activePractical && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
                <Sparkles className="w-3 h-3" />
                {activePractical.timeComplexity.average}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/practicals"
              className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors px-2 py-1"
            >
              <span>Browse All 11 Practicals</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* API Error Notification */}
        {apiErrorBanner && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-200">Execution Notice:</span>
              <p>{apiErrorBanner}</p>
            </div>
          </div>
        )}

        {/* Compiler Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[620px]">
          {/* Left Column: Monaco Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[480px]">
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
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
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
            <div className="flex-1 min-h-[320px]">
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
