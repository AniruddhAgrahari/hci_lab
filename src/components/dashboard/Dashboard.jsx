import React, { useMemo } from 'react';
import { BarChart3, Download, Table, FileSpreadsheet, Activity, TrendingUp, HelpCircle, Target, MousePointer2, Keyboard } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, Cell
} from 'recharts';

const Dashboard = ({ data }) => {
    const stats = useMemo(() => {
        if (!data.reaction || data.reaction.length === 0) return null;

        const reaction = [...data.reaction].sort((a, b) => a - b);
        const mean = reaction.reduce((a, b) => a + b, 0) / reaction.length;
        const median = reaction.length % 2 === 0
            ? (reaction[reaction.length / 2 - 1] + reaction[reaction.length / 2]) / 2
            : reaction[Math.floor(reaction.length / 2)];

        const variance = reaction.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / reaction.length;
        const stdDev = Math.sqrt(variance);

        return { mean: mean.toFixed(2), median: median.toFixed(2), stdDev: stdDev.toFixed(2) };
    }, [data.reaction]);

    const fittsData = useMemo(() => {
        if (!data.fitts || !data.fitts.trials) return [];
        return data.fitts.trials.map(t => ({
            name: `T${t.index + 1}`,
            time: t.duration,
            size: t.size,
            modality: t.inputType
        }));
    }, [data.fitts]);

    const downloadCSV = () => {
        let csv = "Experiment,Metric,Value,Unit\n";

        // Memory
        if (data.memory) {
            csv += `Memory,Accuracy,${data.memory.accuracy},%\n`;
            csv += `Memory,Correct Words,${data.memory.correctCount},count\n`;
        }

        // Reaction
        if (data.reaction.length > 0) {
            data.reaction.forEach((time, i) => {
                csv += `Reaction,Trial ${i + 1},${time},ms\n`;
            });
            csv += `Reaction,Mean,${stats?.mean},ms\n`;
            csv += `Reaction,StdDev,${stats?.stdDev},ms\n`;
        }

        // Fitts
        if (data.fitts?.trials) {
            data.fitts.trials.forEach((t, i) => {
                csv += `Fitts,Target ${i + 1} Time,${t.duration},ms\n`;
                csv += `Fitts,Target ${i + 1} Size,${t.size},px\n`;
                csv += `Fitts,Target ${i + 1} Input,${t.inputType},modality\n`;
            });
            csv += `Fitts,Miss-clicks,${data.fitts.misses},count\n`;
        }

        // Typing
        if (data.typing) {
            csv += `Typing,WPM,${data.typing.wpm},words/min\n`;
            csv += `Typing,Accuracy,${data.typing.accuracy},%\n`;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Explicitly set properties for better browser support
        link.href = url;
        link.download = `hci_lab_results_${new Date().getTime()}.csv`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Small delay before revoking to ensure high compatibility with all browser engines
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 150);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Researcher Dashboard</h2>
                    <p className="text-slate-500 font-medium">Session ID: {new Date().toISOString().split('T')[0]}-EXP-B</p>
                </div>
                <button
                    onClick={downloadCSV}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100"
                >
                    <Download size={20} /> Export CSV Result
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20} /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cognitive</span>
                    </div>
                    <div className="text-2xl font-black">{data.memory?.accuracy.toFixed(1) || 0}%</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Memory Recall Accuracy</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><TrendingUp size={20} /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reaction</span>
                    </div>
                    <div className="text-2xl font-black">{stats?.mean || 0}ms</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Mean Latency</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MousePointer2 size={20} /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pointing</span>
                    </div>
                    <div className="text-2xl font-black">{data.fitts?.trials?.length || 0}/10</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Targets Captured</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Keyboard size={20} /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Typing</span>
                    </div>
                    <div className="text-2xl font-black">{data.typing?.wpm || 0}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Words Per Minute</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reaction Analysis */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="text-slate-900" size={24} />
                        <h3 className="text-xl font-black">Reaction Distribution</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.reaction.map((r, i) => ({ trial: i + 1, time: r }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="trial" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} unit="ms" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="time" fill="#0f172a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                        <div className="text-center">
                            <div className="text-lg font-bold">{stats?.mean}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Mean</div>
                        </div>
                        <div className="text-center border-x border-slate-100">
                            <div className="text-lg font-bold">{stats?.median}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Median</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold">{stats?.stdDev}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Std Dev</div>
                        </div>
                    </div>
                </div>

                {/* Fitts Analysis */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="text-slate-900" size={24} />
                        <h3 className="text-xl font-black">Movement Time vs Target Size</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={fittsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} unit="ms" />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} unit="px" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="time" name="Time (ms)" stroke="#0f172a" strokeWidth={3} dot={{ r: 6, fill: '#0f172a' }} />
                                <Line yAxisId="right" type="monotone" dataKey="size" name="Size (px)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-xs text-slate-400 italic text-center">
                        Note: Shorter movement times for smaller targets indicate high proficiency.
                    </div>
                </div>
            </div>

            {/* Raw Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Table size={20} />
                        <h3 className="font-bold">Raw Session Data</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Experiment</th>
                                <th className="px-6 py-4">Metric</th>
                                <th className="px-6 py-4">Result</th>
                                <th className="px-6 py-4">Modality</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-6 py-4 font-bold">Memory</td>
                                <td className="px-6 py-4 text-slate-500">Recall Accuracy</td>
                                <td className="px-6 py-4 font-mono">{data.memory?.accuracy.toFixed(2)}%</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">Visual</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold">Reaction</td>
                                <td className="px-6 py-4 text-slate-500">Mean Latency</td>
                                <td className="px-6 py-4 font-mono">{stats?.mean}ms</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded text-[10px] font-bold uppercase">Motor</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold">Pointing</td>
                                <td className="px-6 py-4 text-slate-500">Miss-clicks</td>
                                <td className="px-6 py-4 font-mono">{data.fitts?.misses || 0}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">Pointer</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold">Typing</td>
                                <td className="px-6 py-4 text-slate-500">Throughput</td>
                                <td className="px-6 py-4 font-mono">{data.typing?.wpm} WPM</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-[10px] font-bold uppercase">Keyboard</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
