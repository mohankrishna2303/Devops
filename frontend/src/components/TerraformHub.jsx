import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './terraform/css/TerraformHub.css';

// Sub-components
import TerraformHeader from './terraform/TerraformHeader';
import TerraformModulesList from './terraform/TerraformModulesList';
import TerraformActionLog from './terraform/TerraformActionLog';
import TerraformFileViewer from './terraform/TerraformFileViewer';
import TerraformDevOpsGuide from './terraform/TerraformDevOpsGuide';
import TerraformArchitecture from './terraform/TerraformArchitecture';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

const TerraformHub = () => {
    const [modules, setModules] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const [tfFiles, setTfFiles] = useState({});
    const [activeTfFile, setActiveTfFile] = useState('');
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        fetchModules();
        fetchTfFiles();
    }, []);

    const fetchModules = async () => {
        try {
            const res = await API.get('/terraform/hub/');
            setModules(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (e) {
            console.error('Failed to fetch modules:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchTfFiles = async () => {
        const files = ['terraform/main.tf', 'terraform/variables.tf', 'terraform/outputs.tf'];
        const fileData = {};
        for (const f of files) {
            try {
                const res = await API.get(`/files/read/?path=${f}`);
                fileData[f.split('/').pop()] = res.data.content;
            } catch (e) {
                console.error(`Failed to read ${f}`, e);
            }
        }
        if (Object.keys(fileData).length > 0) {
            setTfFiles(fileData);
            setActiveTfFile(Object.keys(fileData)[0]);
        }
    };

    const log = (msg, type = 'info') => {
        const colors = { info: '#4FC3F7', success: '#9D4EDD', error: '#f87171', warn: '#FFB74D' };
        setActionLog(prev => [
            { msg, time: new Date().toLocaleTimeString(), color: colors[type] || colors.info },
            ...prev.slice(0, 29)
        ]);
    };

    const runTerraformInit = async () => {
        setRunning(true);
        log(`▶ terraform init ...`, 'info');
        try {
            const res = await API.post('/terraform/init/');
            log(`✓ ${res.data?.message || 'Initialization success'}`, 'success');
        } catch (e) {
            log(`✗ Initialization failed: ${e.response?.data?.error || e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformPlan = async () => {
        setRunning(true);
        log(`▶ terraform plan ...`, 'info');
        try {
            const res = await API.post('/terraform/plan/');
            const changes = res.data?.changes;
            const msg = changes ? `Plan created: ${changes.add} add, ${changes.change} change, ${changes.destroy} destroy.` : 'Plan created.';
            log(`✓ ${msg}`, 'success');
        } catch (e) {
            log(`✗ Plan failed: ${e.response?.data?.error || e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformApply = async (planName) => {
        setRunning(true);
        log(`▶ terraform apply "${planName || 'plan'}" ...`, 'info');
        try {
            const res = await API.post('/terraform/apply/', { plan_name: planName });
            log(`✓ Apply success: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Apply failed: ${e.response?.data?.error || e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformScale = async (id, name) => {
        const count = prompt(`Scale "${name}" — enter target instance count:`, '3');
        if (!count) return;
        setRunning(true);
        log(`▶ terraform scale "${name}" → ${count} instances`, 'info');
        try {
            const res = await API.post('/terraform/scale/', { plan_id: id, instance_count: parseInt(count) });
            log(`✓ Scale success: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Scale failed: ${e.response?.data?.error || e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const runTerraformDestroy = async (id, name) => {
        if (!window.confirm(`⚠️ DESTROY all infrastructure in "${name}"?\n\nThis is irreversible.`)) return;
        setRunning(true);
        log(`▶ terraform destroy "${name}" ...`, 'warn');
        try {
            const res = await API.post('/terraform/destroy/', { plan_id: id });
            log(`✓ Destroy complete: ${res.data?.message}`, 'success');
            await fetchModules();
        } catch (e) {
            log(`✗ Destroy failed: ${e.response?.data?.error || e.message}`, 'error');
        } finally {
            setRunning(false);
        }
    };

    const stats = {
        modules: modules.length,
        resources: modules.reduce((acc, m) => acc + (m.resources?.length || 0), 0)
    };

    return (
        <div className="terraform-hub-container fade-in" style={{ padding: '20px 40px' }}>
            <TerraformHeader 
                onRefresh={fetchModules} 
                onProvision={() => runTerraformApply('New Module')} 
                stats={stats} 
            />

            <div className="terraform-hub-grid">
                <TerraformModulesList 
                    modules={modules} 
                    loading={loading} 
                    onApply={runTerraformApply}
                    onScale={runTerraformScale}
                    onDestroy={runTerraformDestroy}
                    onInit={runTerraformInit}
                    onPlan={runTerraformPlan}
                />
                <TerraformActionLog 
                    actionLog={actionLog} 
                    setActionLog={setActionLog} 
                />
            </div>

            <TerraformFileViewer 
                tfFiles={tfFiles} 
                activeTfFile={activeTfFile} 
                setActiveTfFile={setActiveTfFile} 
            />

            <TerraformDevOpsGuide />

            <TerraformArchitecture />

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default TerraformHub;
