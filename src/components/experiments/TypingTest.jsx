import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, CheckCircle2, RefreshCw } from 'lucide-react';

const SENTENCE = "The quick brown fox jumps over the lazy dog as it runs latency measurements.";

const TypingTest = ({ onComplete }) => {
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [errors, setErrors] = useState(0);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());

        // Check for errors in real-time
        let currentErrors = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== SENTENCE[i]) {
                currentErrors++;
            }
        }
        setErrors(currentErrors);
        setUserInput(val);

        if (val === SENTENCE) {
            setEndTime(Date.now());
        }
    };

    const calculateResults = () => {
        const timeInMinutes = (endTime - startTime) / 60000;
        const words = SENTENCE.split(" ").length;
        const wpm = Math.round(words / timeInMinutes);
        const accuracy = Math.round(((SENTENCE.length - errors) / SENTENCE.length) * 100);

        onComplete({
            wpm,
            accuracy,
            duration: Math.round((endTime - startTime) / 1000),
            timestamp: new Date().toISOString()
        });
    };

    const reset = () => {
        setUserInput("");
        setStartTime(null);
        setEndTime(null);
        setErrors(0);
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Keyboard className="text-purple-400" />
                    <h2 className="text-xl font-bold">Phase 2B: Keyboard Throughput</h2>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {!endTime ? (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                            <p className="text-2xl font-mono text-slate-300 select-none">
                                {SENTENCE.split("").map((char, i) => {
                                    let color = "text-slate-300";
                                    if (i < userInput.length) {
                                        color = userInput[i] === char ? "text-slate-900" : "text-red-500 bg-red-50";
                                    }
                                    return <span key={i} className={color}>{char}</span>;
                                })}
                            </p>
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reference Text</div>
                        </div>

                        <textarea
                            ref={inputRef}
                            className="w-full h-24 p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-0 transition-all outline-none text-xl font-mono"
                            placeholder="Start typing the sentence above..."
                            value={userInput}
                            onChange={handleChange}
                            spellCheck={false}
                            autoFocus
                        />

                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="text-sm font-bold text-slate-400">
                                    ERRORS: <span className="text-red-500 font-mono">{errors}</span>
                                </div>
                                {startTime && (
                                    <div className="text-sm font-bold text-slate-400">
                                        PROGRESS: <span className="text-slate-900 font-mono">{Math.round((userInput.length / SENTENCE.length) * 100)}%</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={reset} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-8 py-8 animate-in slide-in-from-bottom duration-500">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="text-4xl font-black text-slate-900">
                                    {Math.round(SENTENCE.split(" ").length / ((endTime - startTime) / 60000))}
                                </div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">WPM</div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="text-4xl font-black text-slate-900">
                                    {Math.round(((SENTENCE.length - errors) / SENTENCE.length) * 100)}%
                                </div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</div>
                            </div>
                        </div>

                        <button
                            onClick={calculateResults}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            Generate Researcher Dashboard <CheckCircle2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypingTest;
