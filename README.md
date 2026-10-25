# Online Compiler

A fast, interactive online sandboxed compiler to write, upload, edit, and execute C, C++, and Java programs directly in the browser.

---

## ✨ Features

### ⚡ 1. Online Sandboxed Compiler
- **Multi-Language Support**: C (GCC), C++ (G++), and Java (OpenJDK).
- **Editor**: Line numbers, syntax highlighting, customizable font sizing, and one-click auto-fit.
- **Keyboard Shortcuts**: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>) to instantly compile and run.
- **Standard Input (stdin)**: Provide custom standard input for programs requiring interactive terminal input.
- **Terminal Output Panel**:
  - Clean terminal styling with green output.
  - Interactive status and live execution metrics (execution time and memory).
- **Code Actions**: Copy code, download file, reset code, and upload custom files.

---

### 📁 2. Code Upload & Import
- Compact **Upload Code** button accessible in the top navigation bar.
- Supports dragging and dropping or selecting code files (.c, .cpp, .java, .html, .js).
- Real-time syntax preview before loading into the editor.

---

### 🔒 3. Sandboxed Execution
- Execution requests are routed through a server-side proxy (`/api/execute`) to an isolated execution engine sandbox.
- Payloads are Base64-encoded to guarantee zero truncation or charset encoding issues.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system.
- npm, yarn, pnpm, or bun.

### Installation

1. Clone or open the repository:
   ```bash
   git clone <repo-url>
   cd online-compiler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
