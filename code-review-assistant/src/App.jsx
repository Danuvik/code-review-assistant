import React, { useState, useRef } from 'react';
import { FileUp, Download, Code, ShieldAlert, BookCheck, Puzzle } from 'lucide-react';

// CHANGE THIS with your actual API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const systemPrompt = `
  You are an expert code reviewer. Analyze the user-provided code and return a JSON object.
  Your response MUST be a valid JSON object with the following schema:
  {
    "overallAssessment": "A brief summary of the code's quality.",
    "readability": [ { "suggestion": "A specific suggestion for improving readability.", "codeSnippet": "The relevant line(s) of code." } ],
    "modularity": [ { "suggestion": "A specific suggestion for improving modularity.", "codeSnippet": "The relevant line(s) of code." } ],
    "bugs": [ { "suggestion": "A specific potential bug found.", "codeSnippet": "The relevant line(s) of code." } ]
  }
  For each suggestion, provide the exact corresponding line(s) of code in the "codeSnippet" field. If a suggestion is general and doesn't apply to a specific line, you can leave the "codeSnippet" as an empty string. Do not include markdown or backticks inside the JSON string values.
`;

const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "OBJECT",
    properties: {
      "overallAssessment": { "type": "STRING" },
      "readability": {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { "suggestion": { "type": "STRING" }, "codeSnippet": { "type": "STRING" } },
          required: ["suggestion", "codeSnippet"]
        }
      },
      "modularity": {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { "suggestion": { "type": "STRING" }, "codeSnippet": { "type": "STRING" } },
          required: ["suggestion", "codeSnippet"]
        }
      },
      "bugs": {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { "suggestion": { "type": "STRING" }, "codeSnippet": { "type": "STRING" } },
          required: ["suggestion", "codeSnippet"]
        }
      },
    },
    required: ["overallAssessment", "readability", "modularity", "bugs"]
  }
};

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'jsx', label: 'React (JSX)' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
];

const reviewTabs = [
  { id: 'overall', label: 'Overall Assessment', icon: <Code size={18} /> },
  { id: 'readability', label: 'Readability', icon: <BookCheck size={18} /> },
  { id: 'modularity', label: 'Modularity', icon: <Puzzle size={18} /> },
  { id: 'bugs', label: 'Potential Bugs', icon: <ShieldAlert size={18} /> },
];

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overall');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleFileUploadClick = () => fileInputRef.current.click();

  const handleDownload = () => {
    if (!review) return;
    let reportContent = `Code Review Report\nLanguage: ${language}\n`;
    reportContent += "========================\n\n";
    reportContent += `OVERALL ASSESSMENT:\n${review.overallAssessment}\n\n`;

    const formatCategory = (title, items) => {
      let content = `${title.toUpperCase()}:\n`;
      if (items.length === 0) {
        content += "No specific issues found.\n\n";
      } else {
        items.forEach((item, index) => {
          content += `${index + 1}. Suggestion: ${item.suggestion}\n`;
          if (item.codeSnippet) {
            content += `   Code Snippet: ${item.codeSnippet}\n`;
          }
          content += "\n";
        });
      }
      return content;
    };

    reportContent += formatCategory("Readability", review.readability);
    reportContent += formatCategory("Modularity & Structure", review.modularity);
    reportContent += formatCategory("Potential Bugs & Errors", review.bugs);
    reportContent += "========================\n";

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code_review_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please enter or upload some code to review.');
      return;
    }
    if (!apiKey) {
      setError('API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview(null);
    setActiveTab('overall');

    const userQuery = `Review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: generationConfig
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API request failed: ${errorBody.error.message}`);
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];
      const jsonText = candidate?.content?.parts?.[0]?.text;

      if (jsonText) {
        const parsedReview = JSON.parse(jsonText);
        setReview(parsedReview);
      } else {
        setError('Failed to get a valid review from the model.');
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const ReviewContent = ({ content }) => {
    if (!content) return null;
    if (typeof content === 'string') {
      return content.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-2 last:mb-0 text-slate-300">{paragraph}</p>
      ));
    }
    if (Array.isArray(content)) {
      if (content.length === 0) {
        return <p className="text-slate-400">No specific issues found in this category.</p>;
      }
      return (
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <p className="mb-3 text-slate-200">{item.suggestion}</p>
              {item.codeSnippet && (
                <pre className="bg-slate-900 text-cyan-300 p-3 rounded-md overflow-x-auto border border-slate-600">
                  <code className="text-sm font-mono">{item.codeSnippet}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen font-sans flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 drop-shadow-lg">Code Review Assistant</h1>
          <p className="text-slate-300 mt-2 text-lg">Upload or paste your code for an AI-powered review.</p>
        </header>
        <main className="bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Section - Input */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label htmlFor="language-select" className="text-lg font-semibold text-slate-200">Language</label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your ${languages.find(l => l.value === language)?.label || 'code'} here...`}
                className="w-full h-96 bg-slate-900 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y shadow-inner"
                spellCheck="false"
              />
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".js,.jsx,.ts,.html,.css,.py,.java,.cs,.cpp,.php,.swift,.go,.rb,.rs,.txt" />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleFileUploadClick}
                  disabled={isLoading}
                  className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/20"
                >
                  <FileUp className="mr-2" size={20} /> Upload File
                </button>
                <button
                  onClick={handleReview}
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-cyan-500/50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : ('Review My Code')}
                </button>
              </div>
            </div>

            {/* Right Section - Output */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-slate-200">Review Report</h2>
                {review && (
                  <button onClick={handleDownload} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm shadow-lg transition duration-300">
                    <Download className="mr-2" size={16} /> Download Report
                  </button>
                )}
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 min-h-[30rem] flex flex-col">
                {error && <div className="text-red-300 bg-red-900/30 border border-red-700 p-3 rounded-md">{error}</div>}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <svg className="animate-spin h-10 w-10 text-cyan-500 mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg">Analyzing your code...</p>
                  </div>
                )}
                {!isLoading && !review && !error && (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <p className="text-center">Your code review will appear here.</p>
                  </div>
                )}
                {review && !isLoading && !error && (
                  <>
                    <div className="border-b border-slate-700 mb-4">
                      <nav className="-mb-px flex space-x-2 overflow-x-auto" aria-label="Tabs">
                        {reviewTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                              activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-400 bg-slate-800/50'
                                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                            } flex items-center whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg`}
                          >
                            {tab.icon}
                            <span className="ml-2">{tab.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                    <div className="text-slate-200 overflow-y-auto flex-grow pr-2 custom-scrollbar">
                      {activeTab === 'overall' && <ReviewContent content={review.overallAssessment} />}
                      {activeTab === 'readability' && <ReviewContent content={review.readability} />}
                      {activeTab === 'modularity' && <ReviewContent content={review.modularity} />}
                      {activeTab === 'bugs' && <ReviewContent content={review.bugs} />}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;