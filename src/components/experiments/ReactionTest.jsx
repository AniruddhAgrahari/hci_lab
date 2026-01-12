import React, { useState, useEffect, useRef } from 'react';
import { Zap, Timer, CheckCircle2, AlertCircle } from 'lucide-react';

const ReactionTest = ({ onComplete }) => {
    const [state, setState] = useState('waiting'); // waiting, ready, stim, gap, complete
    const [trials, setTrials] = useState([]);
    const [startTime, setStartTime] = useState(0);
    const timerRef = useRef(null);

    const startTrial = () => {
        setState('ready');
        const delay = Math.random() * 3000 + 2000; // 2-5s
        timerRef.current = setTimeout(() => {
            setStartTime(performance.now());
            setState('stim');
        }, delay);
    };

    const handleClick = () => {
        if (state === 'ready') {
            // Early click
            clearTimeout(timerRef.current);
            alert("Too early! Trial reset.");
            startTrial();
        } else if (state === 'stim') {
            const endTime = performance.now();
            const reactionTime = Math.round(endTime - startTime);
            const newTrials = [...trials, reactionTime];
            setTrials(newTrials);

            if (newTrials.length < 5) {
                setState('gap');
                setTimeout(() => startTrial(), 1000);
            } else {
                setState('complete');
            }
        }
    };

    const handleFinish = () => {
        onComplete(trials);
    };

    const avgReaction = trials.length > 0
        ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length)
        : 0;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Zap className="text-yellow-400" />
                    <h2 className="text-xl font-bold">Phase 1B: Reaction Time</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                    Trial {Math.min(trials.length + 1, 5)} of 5
                </div>
            </div>

            <div className="p-8">
                {state === 'waiting' && (
                    <div className="text-center space-y-6 py-8">
                        <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Zap size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Visual Reaction Test</h3>
                            <p className="text-slate-600">
                                Wait for the box to turn <span className="text-green-600 font-bold uppercase tracking-wider">Green</span>.
                                Move your mouse/finger to the area and click/tap as fast as you can.
                            </p>
                        </div>
                        <button
                            onClick={startTrial}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                        >
                            Start Trials
                        </button>
                    </div>
                )}

                {(state === 'ready' || state === 'stim' || state === 'gap') && (
                    <div className="space-y-6">
                        <div
                            onMouseDown={handleClick}
                            onTouchStart={handleClick}
                            className={`reaction-box ${state === 'stim' ? 'bg-green-500 scale-[1.02]' : 'bg-slate-900'
                                }`}
                        >
                            <div className="text-center">
                                {state === 'ready' && <p className="text-white opacity-50">Wait for green...</p>}
                                {state === 'stim' && <p className="text-white uppercase tracking-[0.2em] animate-pulse">CLICK NOW!</p>}
                                {state === 'gap' && (
                                    <div className="space-y-2">
                                        <CheckCircle2 className="mx-auto text-green-400" size={48} />
                                        <p className="text-white">{trials[trials.length - 1]} ms</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all ${i < trials.length ? 'bg-green-500' : 'bg-slate-200'
                                    }`} />
                            ))}
                        </div>

                        <p className="text-center text-slate-400 text-sm">
                            Precision: performance.now() used for sub-millisecond accuracy.
                        </p>
                    </div>
                )}

                {state === 'complete' && (
                    <div className="text-center space-y-8 py-8 animate-in zoom-in duration-300">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-extrabold">Testing Complete</h3>
                            <div className="text-6xl font-black text-slate-900 tabular-nums">
                                {avgReaction}<span className="text-2xl ml-1 text-slate-400">ms</span>
                            </div>
                            <p className="text-slate-500">Average reaction time over 5 trials</p>
                        </div>

                        <div className="max-w-xs mx-auto space-y-3">
                            {trials.map((time, i) => (
                                <div key={i} className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-lg text-sm border border-slate-100">
                                    <span className="text-slate-400 font-medium tracking-wide">TRIAL {i + 1}</span>
                                    <span className="font-bold font-mono">{time}ms</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleFinish}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
                        >
                            Continue to Modality Testing
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReactionTest;
