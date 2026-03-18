import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Terminal as TerminalIcon, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const Terminal = () => {
    const [history, setHistory] = useState([
        { type: 'info', content: 'BrainDevOps Super-Terminal [Version 1.0.0]' },
        { type: 'info', content: '(c) 2026 BrainDevOps Corporation. All rights reserved.' },
        { type: 'info', content: 'Tip: Type "health-check" to run system diagnostics.' },
        { type: 'info', content: '' },
    ]);
    const [shellType, setShellType] = useState('cmd');
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [cwd, setCwd] = useState('D:\\devops');
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleExecute = async (e) => {
        if (e.key === 'Enter' && input.trim()) {
            const cmd = input.trim();
            setInput('');
            setHistory(prev => [...prev, { type: 'prompt', content: `${cwd}> ${cmd}` }]);

            if (cmd === 'clear') {
                setHistory([]);
                return;
            }

            const actualCmd = cmd === 'health-check' ? 'python scripts/devops_check.py' : cmd;

            setIsProcessing(true);
            try {
                const res = await API.post('/terminal/execute/', { command: actualCmd, cwd });
                if (res.data.stdout) {
                    setHistory(prev => [...prev, { type: 'stdout', content: res.data.stdout }]);
                }
                if (res.data.stderr) {
                    setHistory(prev => [...prev, { type: 'stderr', content: res.data.stderr }]);
                }
                if (res.data.cwd) {
                    setCwd(res.data.cwd);
                }
            } catch (err) {
                setHistory(prev => [...prev, { type: 'error', content: err.response?.data?.error || err.message }]);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: isExpanded ? '20px' : '20px',
            right: '20px',
            width: isExpanded ? 'calc(100% - 300px)' : '400px',
            height: isExpanded ? '600px' : '40px',
            background: '#0D0D14',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
            {/* Terminal Header */}
            <div
                onClick={() => !isExpanded && setIsExpanded(true)}
                style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    borderBottom: isExpanded ? '1px solid var(--glass-border)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TerminalIcon size={16} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>System Terminal</span>
                    {isProcessing && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite' }} />}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        style={{ background: 'transparent', border: 'none', color: '#777', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    {isExpanded && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            style={{ background: 'transparent', border: 'none', color: '#777', cursor: 'pointer' }}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Terminal Body */}
            {isExpanded && (
                <div style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}
                    onClick={() => inputRef.current?.focus()}
                >
                    {history.map((line, i) => (
                        <div key={i} style={{
                            color: line.type === 'error' ? '#ff5f56' :
                                line.type === 'stderr' ? '#ffbd2e' :
                                    line.type === 'prompt' ? 'rgba(255,255,255,0.5)' :
                                        '#9D4EDD',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}>
                            {line.content}
                        </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{cwd}&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleExecute}
                            autoFocus
                            disabled={isProcessing}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: 'inherit'
                            }}
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Terminal;
