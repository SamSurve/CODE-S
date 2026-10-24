'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import CodeEditor from '../../components/CodeEditor';
import RightOutputPanel, { OutputTab } from '../../components/RightOutputPanel';
import UploadModal from '../../components/UploadModal';
import PracticalDetailModal from '../../components/PracticalDetailModal';
import { PRACTICALS, DEFAULT_C_STARTER, DEFAULT_CPP_STARTER } from '../../data/practicals';
import { SupportedLanguage, ExecutionResponse, Practical, CustomRunnerConfig } from '../../types';
import { AlertCircle } from 'lucide-react';

export default function CompilerPage() {
  // Default initial practical: Experiment 1.1 Insertion Sort from PDF Page 1
  const initialPractical = PRACTICALS[0];

  const [language, setLanguage] = useState<SupportedLanguage>(initialPractical.language);
  const [code, setCode] = useState<string>(initialPractical.sourceCode);
  const [sampleOutput, setSampleOutput] = useState<string>(initialPractical.sampleOutput);
  const [sampleInput, setSampleInput] = useState<string>(initialPractical.sampleInput);
  const [stdin, setStdin] = useState<string>(initialPractical.sampleInput);
  const [activePractical, setActivePractical] = useState<Practical | null>(initialPractical);

  // Active tab in right window: starts on 'pdf_sample' immediately on practical selection
  const [outputTab, setOutputTab] = useState<OutputTab>('pdf_sample');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResponse | null>(null);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load practical by ID: Immediately loads original code + original PDF sample output + sample input
  const loadPracticalById = useCallback((id: string) => {
    const p = PRACTICALS.find((item) => item.id === id);
    if (p) {
      setActivePractical(p);
      setCode(p.sourceCode);
      setLanguage(p.language);
      setSampleOutput(p.sampleOutput);
      setSampleInput(p.sampleInput);
      setStdin(p.sampleInput); // Automatically load PDF example input
      setOutputTab('pdf_sample'); // Immediately show "Sample Output from PDF" in right window
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

  // Read URL query parameters on mount or popstate without triggering Suspense
  useEffect(() => {
    const checkUrlParams = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const practical = params.get('practical');
      const source = params.get('source');

      if (practical) {
        loadPracticalById(practical);
      } else if (source === 'upload') {
        const savedCode = localStorage.getItem('aoa_custom_code');
        const savedLang = localStorage.getItem('aoa_custom_lang') as SupportedLanguage;
        if (savedCode) {
          setCode(savedCode);
          if (savedLang) setLanguage(savedLang);
          setActivePractical(null);
          setSampleOutput('');
          setSampleInput('');
          setOutputTab('live_run');
        }
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    return () => window.removeEventListener('popstate', checkUrlParams);
  }, [loadPracticalById]);

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

  // Reset code to original PDF state
  const handleReset = () => {
    if (activePractical) {
      setCode(activePractical.sourceCode);
      setStdin(activePractical.sampleInput);
      setSampleOutput(activePractical.sampleOutput);
      setOutputTab('pdf_sample');
    } else {
      setCode(language === 'cpp' ? DEFAULT_CPP_STARTER : DEFAULT_C_STARTER);
      setStdin('');
      setSampleOutput('');
      setOutputTab('live_run');
    }
    setResult(null);
  };

  // Handle file loaded via upload
  const handleCodeLoaded = (uploadedCode: string, uploadedLang: SupportedLanguage) => {
    setCode(uploadedCode);
    setLanguage(uploadedLang);
    setActivePractical(null);
    setSampleOutput('');
    setSampleInput('');
    setStdin('');
    setOutputTab('live_run');
    setResult(null);
  };

  // Run code against /api/execute using currently visible code and preloaded stdin
  const handleRun = async () => {
    if (!code.trim()) {
      alert('Code editor cannot be empty.');
      return;
    }

    // Switch right window to Live Run Output tab and show loader
    setOutputTab('live_run');
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
          stdin: stdin // Uses preloaded PDF sample input or user-edited input
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
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      <Navbar />

      <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden p-2 sm:p-3">
        {/* API Error Notification if any */}
        {apiErrorBanner && (
          <div className="mb-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-rose-200">Execution Notice:</span>
              <p>{apiErrorBanner}</p>
            </div>
          </div>
        )}

        {/* Side-by-Side Split: Left Editor (50%) + Right Output Window (50%) */}
        <div className="flex-1 flex flex-col lg:flex-row gap-2.5 min-h-0">
          {/* LEFT WINDOW: Controlled, Visible, Editable Code Editor */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col min-h-0">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRun={handleRun}
              onReset={handleReset}
              isLoading={isLoading}
              onUploadClick={() => setIsUploadOpen(true)}
              activePracticalTitle={activePractical?.title}
              activePracticalExpNumber={activePractical?.expNumber}
            />
          </div>

          {/* RIGHT WINDOW: Output Terminal (Shows "Sample Output from PDF" immediately, Live Output on Run) */}
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col min-h-0">
            <RightOutputPanel
              activeTab={outputTab}
              onTabChange={setOutputTab}
              sampleOutput={sampleOutput}
              sampleInput={sampleInput}
              stdin={stdin}
              onStdinChange={setStdin}
              result={result}
              isLoading={isLoading}
              onClearLive={() => setResult(null)}
              practicalTitle={activePractical?.title}
              practicalExpNumber={activePractical?.expNumber}
            />
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCodeLoaded={handleCodeLoaded}
      />

      {/* Practical Detail Modal */}
      <PracticalDetailModal
        practical={activePractical}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
