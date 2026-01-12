import React, { useState, useEffect } from 'react';
import { Timer, Brain, CheckCircle2, ChevronRight, Info } from 'lucide-react';

const TECH_WORDS = [
    "Latency", "Bandwidth", "Heuristic", "Affordance", "Haptic",
    "Cognition", "Throughput", "Fitts Law", "Ergonomics", "Biometrics",
    "Synchronous", "Middleware", "Protocol", "Cybernetics", "Metadata",
    "Scalability", "Interface", "Usability", "Topology", "Encapsulation"
];

const MemoryTest = ({ onComplete }) => {
    const [phase, setPhase] = useState('intro'); // intro, study, recall
    const [words, setWords] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [userInput, setUserInput] = useState("");

    const startStudy = () => {
        const shuffled = [...TECH_WORDS].sort(() => 0.5 - Math.random());
        setWords(shuffled.slice(0, 10));
        setPhase('study');
        setTimeLeft(30);
    };

    useEffect(() => {
        let timer;
        if (phase === 'study' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (phase === 'study' && timeLeft === 0) {
            setPhase('recall');
        }
        return () => clearInterval(timer);
    }, [phase, timeLeft]);

    const handleSubmit = () => {
        const userWords = userInput.toLowerCase().split(/[,\s\n]+/).filter(w => w.trim() !== "");
        const correctWords = words.map(w => w.toLowerCase());

        let correctCount = 0;
        userWords.forEach(word => {
            if (correctWords.includes(word)) {
                correctCount++;
            }
        });

        const accuracy = (correctCount / words.length) * 100;
        onComplete({
            type: 'Memory Recall',
            totalWords: words.length,
            correctCount,
            accuracy,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Brain className="text-blue-400" />
                    <h2 className="text-xl font-bold">Phase 1A: Cognitive Memory</h2>
                </div>
                {phase === 'study' && (
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                        <Timer size={18} className="text-blue-400" />
                        <span className="font-mono text-lg">{timeLeft}s remaining</span>
                    </div>
                )}
            </div>

            <div className="p-8">
                {phase === 'intro' && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Brain size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Short-Term Memory Task</h3>
                            <p className="text-slate-600">
                                You will be shown 10 technical terms for 30 seconds.
                                Your goal is to memorize as many as possible.
                                After the time is up, you will be asked to list them.
                            </p>
                        </div>
                        <button
                            onClick={startStudy}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                        >
                            Start Study Period <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {phase === 'study' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {words.map((word, i) => (
                                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800 shadow-sm animate-in zoom-in duration-300">
                                    {word}
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Focus on the words. Try to create associations or an acronym to help with recall.
                                The interface will automatically switch to the recall phase once the timer hits zero.
                            </p>
                        </div>
                    </div>
                )}

                {phase === 'recall' && (
                    <div className="space-y-6">
                        <div className="space-y-2 text-center">
                            <h3 className="text-2xl font-bold">Recall Phase</h3>
                            <p className="text-slate-600">Enter the words you remember below, separated by commas or spaces.</p>
                        </div>
                        <textarea
                            className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-0 transition-all outline-none text-lg"
                            placeholder="e.g. Latency, Heuristic, Interface..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            autoFocus
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!userInput.trim()}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Submit Recall Results <CheckCircle2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryTest;
