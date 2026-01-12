import React, { useState, useEffect, useRef } from 'react';
import { Target, MousePointer2, AlertCircle, CheckCircle2 } from 'lucide-react';

const FittsTest = ({ onComplete }) => {
    const [phase, setPhase] = useState('intro'); // intro, testing, complete
    const [targetIndex, setTargetIndex] = useState(0);
    const [trials, setTrials] = useState([]);
    const [startTime, setStartTime] = useState(0);
    const [currentTarget, setCurrentTarget] = useState(null);
    const containerRef = useRef(null);
    const [misses, setMisses] = useState(0);

    const generateTarget = () => {
        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        const size = Math.floor(Math.random() * 40) + 20; // 20-60px
        const x = Math.floor(Math.random() * (width - size - 40)) + 20;
        const y = Math.floor(Math.random() * (height - size - 40)) + 20;

        setCurrentTarget({ x, y, size });
        setStartTime(performance.now());
    };

    const startTest = () => {
        setPhase('testing');
        setTargetIndex(0);
        setTrials([]);
        setMisses(0);
        // Delay slightly to allow container to render
        setTimeout(generateTarget, 100);
    };

    const handleContainerClick = (e) => {
        if (phase !== 'testing') return;
        setMisses(prev => prev + 1);
    };

    const handleTargetClick = (e) => {
        e.stopPropagation();
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        const inputType = e.pointerType || (e.touches ? 'touch' : 'mouse');

        const trial = {
            index: targetIndex,
            duration,
            size: currentTarget.size,
            x: currentTarget.x,
            y: currentTarget.y,
            inputType
        };

        const newTrials = [...trials, trial];
        setTrials(newTrials);

        if (targetIndex < 9) {
            setTargetIndex(targetIndex + 1);
            generateTarget();
        } else {
            setPhase('complete');
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto h-[600px] flex flex-col">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Target className="text-red-400" />
                    <h2 className="text-xl font-bold">Phase 2A: Pointing Performance (Fitts's Law)</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                    {phase === 'testing' ? `Target ${targetIndex + 1} of 10` : 'Benchmarking'}
                </div>
            </div>

            <div className="relative flex-grow bg-slate-50 overflow-hidden" ref={containerRef} onPointerDown={handleContainerClick}>
                {phase === 'intro' && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 bg-white/90 backdrop-blur-sm z-10 text-center">
                        <div className="max-w-md space-y-6">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
                                <Target size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Pointing Modality Test</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Targets of varying sizes will appear at random locations.
                                    Click or tap each target as quickly and accurately as possible.
                                    We are measuring <span className="font-bold underline decoration-red-500">Speed-Accuracy Tradeoffs</span>.
                                </p>
                            </div>
                            <button
                                onClick={startTest}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                            >
                                Launch Grid
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'testing' && currentTarget && (
                    <div
                        onPointerDown={handleTargetClick}
                        className="fitts-target"
                        style={{
                            left: `${currentTarget.x}px`,
                            top: `${currentTarget.y}px`,
                            width: `${currentTarget.size}px`,
                            height: `${currentTarget.size}px`,
                        }}
                    />
                )}

                {phase === 'complete' && (
                    <div className="absolute inset-0 flex items-center justify-center p-8 bg-white z-10 text-center">
                        <div className="max-w-md space-y-8 animate-in zoom-in duration-300">
                            <CheckCircle2 className="mx-auto text-green-500" size={64} />
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black">Data Captured</h3>
                                <p className="text-slate-500">
                                    You missed {misses} times.
                                    Average movement time: {Math.round(trials.reduce((a, b) => a + b.duration, 0) / trials.length)}ms.
                                </p>
                            </div>
                            <button
                                onClick={() => onComplete({ trials, misses })}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-lg"
                            >
                                Proceed to Typing Benchmarking
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-between text-[10px] uppercase tracking-widest text-slate-400 font-bold shrink-0">
                <span>Coordinate System: Screen-Relative</span>
                <span>Input Polling: 1000Hz (OS level)</span>
            </div>
        </div>
    );
};

export default FittsTest;
