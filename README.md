# AOA Practical Codes — Write. Run. Learn.

An interactive Analysis of Algorithms (AOA) practical library and online sandboxed compiler where engineering students can study, write, upload, edit, and execute C and C++ programs directly in their browser.

Built for **Analysis of Algorithms (Sem-4 / Sem-5 Computer Engineering / AI & DS / IT)** based on the official college laboratory syllabus.

---

## ✨ Features

### 📚 1. Official AOA Practical Library
All 11 core Analysis of Algorithms experiments with documented aims, step-by-step algorithms, time & space complexities, verified lab codes, and verified sample test cases:
1. **Experiment 1.1: Insertion Sort** *(Divide & Conquer / Incremental — $O(n^2)$)*
2. **Experiment 1.2: Selection Sort** *(Brute Force / Comparison — $O(n^2)$)*
3. **Experiment 2: Binary Search** *(Divide & Conquer — $O(\log n)$)*
4. **Experiment 3: Dijkstra's Algorithm** *(Greedy Single-Source Shortest Path — $O(V^2)$)*
5. **Experiment 4: 0/1 Knapsack Problem** *(Dynamic Programming Tabulation & Traceback — $O(n \cdot M)$)*
6. **Experiment 5: Longest Common Subsequence (LCS)** *(Dynamic Programming Table & Backtrack — $O(m \cdot n)$)*
7. **Experiment 6: Graph Traversals (BFS & DFS)** *(Queue-based BFS & Recursive DFS — $O(V + E)$)*
8. **Experiment 7: N-Queen Problem** *(Recursive Backtracking Chessboard Placement — $O(N!)$)*
9. **Experiment 8: 15 Puzzle using Branch and Bound** *(Least Cost Search with Misplaced Tile Heuristic)*
10. **Experiment 9: Naive String Matching** *(Brute Force Pattern Search — $O((n - m + 1) \cdot m)$)*
11. **Experiment 10: Min-Max Algorithm** *(Divide and Conquer Dual Extrema — $\frac{3n}{2} - 2$ comparisons)*

Each practical card includes:
- **Aim & Concept Overview**
- **Step-by-Step Numbered Algorithm**
- **Time Complexity** (Best, Average, Worst) and **Space Complexity**
- **Lab Tested Source Code** (with one-click copy)
- **Sample Input & Expected Output**
- **"Run This Code" Button**: Pre-fills the code and sample stdin into the online compiler in one click.

---

### ⚡ 2. Online Sandboxed Compiler
- **C & C++ Support**: GCC 9.2+ & G++ 9.2+ compilers.
- **VS Code Monaco Editor**: Line numbers, syntax highlighting, bracket matching, dark/light themes, customizable font sizing.
- **Keyboard Shortcuts**: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>) to instantly compile and run.
- **Custom Standard Input (stdin)**: Easily input test data for programs using `scanf()` and `cin`, with a "Use Sample Input" button.
- **Terminal Output Panel**:
  - Displays real execution `stdout` with dark terminal styling.
  - Highlights `stderr` and compiler error diagnostics.
  - Execution status badges: `Accepted`, `Compilation Error`, `Time Limit Exceeded`, `Runtime Error`.
  - Live execution metrics: execution time (in seconds) and memory consumed (in KB).
- **Code Actions**: Copy code, download as `.c` / `.cpp`, reset to initial code, and clear output.
- **Practical Quick-Switcher**: Dropdown right in the compiler workspace to jump between practicals instantly.

---

### 📁 3. Code Upload & Import
- Compact **Upload Code** button accessible in the top navigation bar.
- Supports dragging and dropping or selecting `.c` and `.cpp` files.
- Real-time syntax preview, line count, and file size detection before opening in the compiler.

---

### 🔒 4. Secure Sandboxed Execution (Zero Server Execution)
- Code is **never executed directly on the Next.js server**.
- Execution requests are routed through a server-side API proxy (`/api/execute`) to an isolated **Judge0 Community Edition** sandbox.
- Payloads are Base64-encoded to guarantee zero truncation or charset encoding issues.
- Private API keys are kept strictly on the server and never exposed to the client.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Code Editor**: `@monaco-editor/react` (VS Code Editor engine)
- **Icons**: `lucide-react`
- **Compiler Sandbox**: Judge0 Community Edition API / RapidAPI Judge0
- **Hosting**: Optimized for [Vercel](https://vercel.com/) (Zero server setup required)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 20 & 24)
- npm or yarn or pnpm

### 2. Installation
```bash
git clone <your-repo-url>
cd "PRACTICAL CODES"
npm install
```

### 3. Environment Setup
Create a `.env.local` file (or copy `.env.example`):
```bash
cp .env.example .env.local
```

Default settings connect to the public Judge0 Community Edition endpoint:
```env
JUDGE0_API_URL=https://ce.judge0.com
```

If you prefer to use RapidAPI Judge0:
```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `JUDGE0_API_URL` = `https://ce.judge0.com` (or your RapidAPI / self-hosted endpoint)
   - *(Optional)* `JUDGE0_API_KEY` and `JUDGE0_API_HOST` if using RapidAPI.
4. Click **Deploy**. Vercel will build and host the application with serverless execution proxying.

---

## 📄 License & Attribution
- Practical programs and test outputs sourced from the official AOA lab curriculum (**Siddhant Surve, Roll 101, B-5**).
- Open-source educational resource for computer engineering students.
