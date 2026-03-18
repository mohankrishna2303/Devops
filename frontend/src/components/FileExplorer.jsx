import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Play, FileText, Database, Code, Server, Shield } from 'lucide-react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const FileExplorer = () => {
    const [structure, setStructure] = useState([
        {
            name: 'devops-project',
            type: 'folder',
            isOpen: true,
            children: [
                {
                    name: 'backend',
                    type: 'folder',
                    icon: <Database size={16} />,
                    isOpen: true,
                    children: [
                        { name: 'api/', type: 'folder' },
                        { name: 'core/', type: 'folder' },
                        { name: 'manage.py', type: 'file' },
                        { name: 'requirements.txt', type: 'file' }
                    ]
                },
                {
                    name: 'frontend',
                    type: 'folder',
                    icon: <Code size={16} />,
                    isOpen: true,
                    children: [
                        { name: 'src/', type: 'folder' },
                        { name: 'public/', type: 'folder' },
                        { name: 'package.json', type: 'file' },
                        { name: 'vite.config.js', type: 'file' }
                    ]
                },
                {
                    name: 'terraform',
                    type: 'folder',
                    icon: <Server size={16} />,
                    isOpen: false,
                    children: [
                        { name: 'main.tf', type: 'file', tool: 'Terraform' },
                        { name: 'variables.tf', type: 'file' },
                        { name: 'outputs.tf', type: 'file' }
                    ]
                },
                {
                    name: 'kubernetes',
                    type: 'folder',
                    icon: <Server size={16} />,
                    isOpen: false,
                    children: [
                        { name: 'deployment.yaml', type: 'file', tool: 'Kubernetes' },
                        { name: 'service.yaml', type: 'file' },
                        { name: 'ingress.yaml', type: 'file' }
                    ]
                },
                {
                    name: 'security',
                    type: 'folder',
                    icon: <Shield size={16} />,
                    isOpen: false,
                    children: [
                        { name: 'audit-report.pdf', type: 'file' },
                        { name: 'encryption-keys.vault', type: 'file', tool: 'Vault' }
                    ]
                },
                { name: 'Dockerfile', type: 'file', tool: 'Docker' },
                { name: 'Jenkinsfile', type: 'file', tool: 'Jenkins' },
                { name: '.github/workflows/ci.yml', type: 'file', tool: 'GitHub Actions' }
            ]
        }
    ]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    const toggleFolder = (path) => {
        const update = (items) => items.map(item => {
            if (item.name === path) return { ...item, isOpen: !item.isOpen };
            if (item.children) return { ...item, children: update(item.children) };
            return item;
        });
        setStructure(update(structure));
    };

    const handleFileClick = async (file) => {
        setSelectedFile(file);
        setFileContent('Loading content from backend...');

        try {
            // Simulate reading actual files or just show mock templates
            setTimeout(() => {
                if (file.name === 'Dockerfile') {
                    setFileContent('FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]');
                } else if (file.name === 'main.tf') {
                    setFileContent('resource "aws_instance" "app" {\n  ami = "ami-12345"\n  instance_type = "t3.micro"\n}');
                } else {
                    setFileContent(`// Content of ${file.name}\n// Integration: ${file.tool || 'General'}\n\n[SIMULATED FILE DATA]`);
                }
            }, 500);
        } catch (err) {
            setFileContent('Error reading file.');
        }
    };

    const renderTree = (items, depth = 0) => {
        return items.map((item, i) => (
            <div key={i} style={{ paddingLeft: `${depth * 20}px` }}>
                {item.type === 'folder' ? (
                    <div
                        onClick={() => toggleFolder(item.name)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', background: item.isOpen ? 'rgba(0,210,255,0.08)' : 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = item.isOpen ? 'rgba(0,210,255,0.08)' : 'transparent'}
                    >
                        {item.isOpen ? <ChevronDown size={14} color={item.isOpen ? 'var(--primary)' : 'white'} /> : <ChevronRight size={14} />}
                        {item.icon ? React.cloneElement(item.icon, { color: item.isOpen ? 'var(--primary)' : item.icon.props.color }) : <Folder size={16} color={item.isOpen ? "var(--primary)" : "#4FC3F7"} />}
                        <span style={{ fontSize: '14px', color: item.isOpen ? 'var(--primary)' : 'white', fontWeight: item.isOpen ? '600' : 'normal' }}>{item.name}</span>
                    </div>
                ) : (
                    <div
                        onClick={() => handleFileClick(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', background: selectedFile === item ? 'rgba(0,210,255,0.15)' : 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = selectedFile === item ? 'rgba(0,210,255,0.15)' : 'transparent'}
                    >
                        <div style={{ width: '14px' }} />
                        <File size={16} color={selectedFile === item ? 'var(--primary)' : '#bbb'} />
                        <span style={{ fontSize: '14px', color: selectedFile === item ? 'var(--primary)' : (item.tool ? '#9D4EDD' : '#ddd') }}>{item.name} {item.tool && `[${item.tool}]`}</span>
                    </div>
                )}
                {item.type === 'folder' && item.isOpen && item.children && renderTree(item.children, depth + 1)}
            </div>
        ));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', height: '500px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h5 style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Structure</h5>
                {renderTree(structure)}
            </div>
            <div style={{ background: '#080810', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ margin: 0, fontSize: '14px', color: '#9D4EDD' }}>
                        {selectedFile ? selectedFile.name : 'Select a file to view content'}
                    </h5>
                    {selectedFile?.tool && (
                        <span style={{ fontSize: '10px', background: 'rgba(157,78,221,0.1)', color: '#9D4EDD', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                            INTEGRATED: {selectedFile.tool.toUpperCase()}
                        </span>
                    )}
                </div>
                <pre style={{ flex: 1, margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#88aaff', overflow: 'auto', lineHeight: '1.6' }}>
                    {fileContent || '// Select a file from the tree to explore tool connectivity.'}
                </pre>
            </div>
        </div>
    );
};

export default FileExplorer;
