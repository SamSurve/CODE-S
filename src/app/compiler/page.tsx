'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import CodeEditor, { EditorFile } from '../../components/CodeEditor';
import RightOutputPanel, { OutputPanelTab } from '../../components/RightOutputPanel';
import HiddenHotspotMenu from '../../components/HiddenHotspotMenu';
import { SupportedLanguage, ExecutionResponse } from '../../types';
import { Item } from '../../data/library/types';
import { AlertCircle } from 'lucide-react';

const DEFAULT_TEMPLATES: Record<SupportedLanguage, { fileName: string; code: string }> = {
  c: {
    fileName: 'main.c',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`
  },
  cpp: {
    fileName: 'main.cpp',
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`
  },
  java: {
    fileName: 'Main.java',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
  },
  html: {
    fileName: 'index.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`
  },
  javascript: {
    fileName: 'main.js',
    code: `console.log("Hello, World!");
`
  }
};

function buildWebSrcdoc(files: EditorFile[]): string {
  const isReact = files.some(
    (f) => f.name.endsWith('.js') && (f.code.includes('useState') || f.code.includes('React'))
  );

  if (isReact) {
    const appFile = files.find((f) => f.name.includes('App')) || files[0];
    const cleanCode = (appFile?.code || '')
      .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '')
      .replace(/^export\s+default\s+[\w$]+;?/gm, '')
      .replace(/^export\s+/gm, '');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111827; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;
    ${cleanCode}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;
  }

  let htmlFile = files.find((f) => f.name.endsWith('.html'));
  let html = htmlFile ? htmlFile.code : '<div>No HTML file</div>';

  // Inline CSS
  const cssFiles = files.filter((f) => f.name.endsWith('.css'));
  cssFiles.forEach((css) => {
    const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\./)?${css.name}["'][^>]*>`, 'gi');
    if (linkRegex.test(html)) {
      html = html.replace(linkRegex, `<style>${css.code}</style>`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>${css.code}</style></head>`);
    } else {
      html = `<style>${css.code}</style>` + html;
    }
  });

  // Inline JS
  const jsFiles = files.filter((f) => f.name.endsWith('.js'));
  jsFiles.forEach((js) => {
    const scriptRegex = new RegExp(
      `<script[^>]*src=["'](?:\\./)?${js.name}["'][^>]*>\\s*</script>`,
      'gi'
    );
    if (scriptRegex.test(html)) {
      html = html.replace(scriptRegex, `<script>${js.code}</script>`);
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', `<script>${js.code}</script></body>`);
    } else {
      html = html + `<script>${js.code}</script>`;
    }
  });

  return html;
}

export default function CompilerPage() {
  const [language, setLanguage] = useState<SupportedLanguage>('c');

  // Multi-file editor state
  const [files, setFiles] = useState<EditorFile[]>([
    {
      name: DEFAULT_TEMPLATES.c.fileName,
      code: DEFAULT_TEMPLATES.c.code
    }
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  // Stored original item state for Reset
  const [loadedItem, setLoadedItem] = useState<Item | null>(null);

  // Right panel state
  const [outputTab, setOutputTab] = useState<OutputPanelTab>('output');
  const [stdin, setStdin] = useState<string>('');
  const [savedOutput, setSavedOutput] = useState<string>('');
  const [liveOutput, setLiveOutput] = useState<string>('');
  const [isLiveResult, setIsLiveResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWebPreview, setShowWebPreview] = useState<boolean>(false);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);

  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [executionMemory, setExecutionMemory] = useState<number | null>(null);

  // Language Change
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    // If no custom item is loaded, load clean template
    if (!loadedItem) {
      const template = DEFAULT_TEMPLATES[newLang] || DEFAULT_TEMPLATES.c;
      setFiles([{ name: template.fileName, code: template.code }]);
      setActiveFileIndex(0);
      setSavedOutput('');
      setLiveOutput('');
      setIsLiveResult(false);
      setShowWebPreview(false);
      setStdin('');
    }
  };

  // Editing file code
  const handleFileCodeChange = (newCode: string) => {
    setFiles((prev) => {
      const copy = [...prev];
      if (copy[activeFileIndex]) {
        copy[activeFileIndex] = { ...copy[activeFileIndex], code: newCode };
      }
      return copy;
    });
  };

  // Load an EXP from the hidden library
  const handleSelectExp = useCallback((item: Item) => {
    setLoadedItem(item);
    const itemLang = item.language as SupportedLanguage;
    setLanguage(itemLang);
    setFiles(item.files.map((f) => ({ name: f.name, code: f.code })));
    setActiveFileIndex(0);
    setStdin(item.sampleInput || '');
    setSavedOutput(item.savedOutput || '');
    setLiveOutput('');
    setIsLiveResult(false);
    setShowWebPreview(false);
    setOutputTab('output');
    setApiErrorBanner(null);
    setExecutionTime(null);
    setExecutionMemory(null);
  }, []);

  // Reset to original code and saved output
  const handleReset = () => {
    if (loadedItem) {
      setFiles(loadedItem.files.map((f) => ({ name: f.name, code: f.code })));
      setActiveFileIndex(0);
      setStdin(loadedItem.sampleInput || '');
      setSavedOutput(loadedItem.savedOutput || '');
      setLiveOutput('');
      setIsLiveResult(false);
      setShowWebPreview(false);
      setApiErrorBanner(null);
    } else {
      const template = DEFAULT_TEMPLATES[language] || DEFAULT_TEMPLATES.c;
      setFiles([{ name: template.fileName, code: template.code }]);
      setActiveFileIndex(0);
      setSavedOutput('');
      setLiveOutput('');
      setIsLiveResult(false);
      setShowWebPreview(false);
      setStdin('');
      setApiErrorBanner(null);
    }
  };

  // Upload custom code
  const handleUploadCode = (code: string, fileName?: string) => {
    setLoadedItem(null);
    const name = fileName || (language === 'java' ? 'Main.java' : 'main.c');
    let detectedLang = language;
    if (name.endsWith('.java')) detectedLang = 'java';
    else if (name.endsWith('.cpp')) detectedLang = 'cpp';
    else if (name.endsWith('.c')) detectedLang = 'c';
    else if (name.endsWith('.html')) detectedLang = 'html';
    else if (name.endsWith('.js')) detectedLang = 'javascript';

    setLanguage(detectedLang);
    setFiles([{ name, code }]);
    setActiveFileIndex(0);
    setSavedOutput('');
    setLiveOutput('');
    setIsLiveResult(false);
    setShowWebPreview(false);
    setStdin('');
  };

  // Map language to Judge0 ID
  const getLanguageId = (lang: SupportedLanguage): number => {
    switch (lang) {
      case 'c':
        return 50;
      case 'cpp':
        return 54;
      case 'java':
        return 62;
      default:
        return 50;
    }
  };

  // Run execution
  const handleRun = async () => {
    if (isLoading) return;

    const currentMode = loadedItem?.mode || 'console';

    // Static mode: Run is disabled
    if (currentMode === 'static') {
      return;
    }

    // Web mode: Render inside sandboxed iframe in Output panel
    if (currentMode === 'web') {
      setShowWebPreview(true);
      setIsLiveResult(true);
      setOutputTab('output');
      return;
    }

    // Console mode: Execute on server / Judge0
    setIsLoading(true);
    setApiErrorBanner(null);

    try {
      // Find main source code
      const mainFile = files[0];
      const sourceCode = mainFile ? mainFile.code : '';
      const languageId = getLanguageId(language);

      // Read custom runner configuration if configured
      let customHeaders: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('compiler_runner_config');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.apiUrl) customHeaders['x-judge0-url'] = parsed.apiUrl;
            if (parsed.apiKey) customHeaders['x-judge0-key'] = parsed.apiKey;
            if (parsed.apiHost) customHeaders['x-judge0-host'] = parsed.apiHost;
            if (parsed.authToken) customHeaders['x-judge0-token'] = parsed.authToken;
          } catch {
            // ignore
          }
        }
      }

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          stdin
        })
      });

      const data: ExecutionResponse = await response.json();

      if (!response.ok) {
        setApiErrorBanner(data.error || 'Execution request failed.');
      }

      // Live result replaces saved output
      const resultText = data.stdout || data.stderr || data.compile_output || data.message || '';
      setLiveOutput(resultText);
      setIsLiveResult(true);
      setOutputTab('output');
      setExecutionTime(data.time || null);
      setExecutionMemory(data.memory || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execution error';
      setApiErrorBanner(msg);
      setLiveOutput(msg);
      setIsLiveResult(true);
      setOutputTab('output');
    } finally {
      setIsLoading(false);
    }
  };

  // Output content to display: live result if executed, else saved output
  const displayedOutput = isLiveResult ? liveOutput : savedOutput;
  const webSrcdoc = useMemo(() => buildWebSrcdoc(files), [files]);
  const isWebMode = (loadedItem?.mode === 'web') || language === 'html';
  const isRunDisabled = loadedItem?.mode === 'static';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-zinc-100 font-sans">
      {/* Generic Navbar */}
      <Navbar onUploadCode={handleUploadCode} />

      {/* API Error Notification */}
      {apiErrorBanner && (
        <div className="bg-red-950/80 border-b border-red-800/80 px-4 py-2 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{apiErrorBanner}</span>
          </div>
          <button
            onClick={() => setApiErrorBanner(null)}
            className="text-red-400 hover:text-red-100 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split Layout: Left Code Editor (60%) | Right Output Panel (40%) */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Code Editor */}
        <section className="flex-1 min-w-0 h-1/2 md:h-full md:w-[60%] flex flex-col">
          <CodeEditor
            files={files}
            activeFileIndex={activeFileIndex}
            onActiveFileIndexChange={setActiveFileIndex}
            code={files[activeFileIndex]?.code || ''}
            onChange={handleFileCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onReset={handleReset}
            isLoading={isLoading}
            onUploadClick={() => {
              const uploadBtn = document.querySelector('header button[title="Upload code file"]') as HTMLButtonElement;
              if (uploadBtn) uploadBtn.click();
            }}
            isRunDisabled={isRunDisabled}
          />
        </section>

        {/* Right Side: Output and Stdin Panel */}
        <section className="h-1/2 md:h-full md:w-[40%] flex flex-col border-t md:border-t-0 border-zinc-800">
          <RightOutputPanel
            activeTab={outputTab}
            onTabChange={setOutputTab}
            outputContent={displayedOutput}
            isLiveResult={isLiveResult}
            stdin={stdin}
            onStdinChange={setStdin}
            isLoading={isLoading}
            executionTime={executionTime}
            executionMemory={executionMemory}
            isWebMode={isWebMode}
            webSrcdoc={webSrcdoc}
            showWebPreview={showWebPreview}
            onClearOutput={() => {
              setLiveOutput('');
              setSavedOutput('');
              setIsLiveResult(false);
              setShowWebPreview(false);
            }}
          />
        </section>
      </main>

      {/* Hidden Student Hotspot Menu */}
      <HiddenHotspotMenu onSelectItem={handleSelectExp} />
    </div>
  );
}
