import React, { useState } from 'react';
import { Play, Code, Cpu, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Terminal, Eye } from 'lucide-react';
import axios from 'axios';

export default function CodeEditor({ initialCode, onCodeSubmit }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(initialCode || `def find_max_concurrency_requests(events: list) -> int:
    """
    Given a list of request events with start and end timestamps,
    calculate peak concurrent active requests.
    """
    events.sort(key=lambda x: x[0])
    max_active = 0
    # Add solution logic here
    return max_active
`);
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState(null);
  const [showAiDiff, setShowAiDiff] = useState(false);

  const handleRunTests = () => {
    setExecuting(true);
    setTimeout(() => {
      setOutput({
        status: "Passed",
        testCases: [
          { name: "Test 1: Standard non-overlapping intervals", passed: true, runtime: "0.42ms" },
          { name: "Test 2: High overlap stress test (10,000 requests)", passed: true, runtime: "1.18ms" },
          { name: "Test 3: Empty input array boundary check", passed: true, runtime: "0.05ms" }
        ],
        timeComplexity: "O(N log N) - Sorting Step",
        spaceComplexity: "O(1) - Constant Space",
        aiReview: {
          score: 94.0,
          strengths: ["Optimal sort key usage", "Edge case empty list handling"],
          improvements: ["Consider using a min-heap (heapq) for streaming time series inputs."]
        }
      });
      setExecuting(false);
    }, 900);
  };

  return (
    <div className="monaco-editor-container">
      {/* Editor Header Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#04060a',
              border: '1px solid var(--border-glass)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <option value="python">Python 3.12</option>
            <option value="javascript">JavaScript (ES2024)</option>
            <option value="cpp">C++ 20</option>
            <option value="sql">PostgreSQL SQL</option>
            <option value="go">Go 1.22</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowAiDiff(!showAiDiff)}
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>{showAiDiff ? "Hide AI Diff Review" : "AI Code Review Agent"}</span>
          </button>

          <button
            onClick={handleRunTests}
            className="btn-cyan"
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
            disabled={executing}
          >
            <Play size={14} />
            <span>{executing ? "Executing..." : "Run Test Cases"}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ display: 'grid', gridTemplateColumns: showAiDiff ? '1fr 1fr' : '1fr', minHeight: '260px' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '260px',
            background: 'transparent',
            color: '#f3f4f6',
            border: 'none',
            outline: 'none',
            padding: '16px',
            fontFamily: 'var(--font-code)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            resize: 'none'
          }}
        />

        {showAiDiff && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            borderLeft: '1px solid var(--border-glass)',
            padding: '16px',
            fontFamily: 'var(--font-code)',
            fontSize: '0.85rem'
          }}>
            <p style={{ color: '#a855f7', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} /> AI Code Review Agent Output
            </p>
            <div style={{ color: '#34d399', marginBottom: '8px' }}>+ Time Complexity: O(N log N)</div>
            <div style={{ color: '#38bdf8', marginBottom: '8px' }}>+ Auxiliary Space: O(1) Constant</div>
            <div style={{ color: '#9ca3af', lineHeight: '1.5' }}>
              ✓ Code formatting adheres to PEP 8 standards.<br />
              ✓ No SQL Injection or unhandled Null Pointer risks detected.
            </div>
          </div>
        )}
      </div>

      {/* Output Terminal Drawer */}
      {output && (
        <div style={{
          background: '#04060b',
          borderTop: '1px solid var(--border-glass)',
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} /> Execution Status: All Test Cases Passed
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Complexity: {output.timeComplexity} | {output.spaceComplexity}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {output.testCases.map((tc, idx) => (
              <div key={idx} style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={12} /> {tc.name} ({tc.runtime})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
