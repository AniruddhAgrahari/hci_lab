import React, { useState, useEffect } from 'react';
import { Layout, Brain, MousePointer2, BarChart3, Info, ChevronRight, Menu, X } from 'lucide-react';
import MemoryTest from './components/experiments/MemoryTest';
import ReactionTest from './components/experiments/ReactionTest';
import FittsTest from './components/experiments/FittsTest';
import TypingTest from './components/experiments/TypingTest';
import Dashboard from './components/dashboard/Dashboard';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [labData, setLabData] = useState({
    memory: null,
    reaction: [],
    fitts: [],
    typing: null
  });

  const saveMemoryResult = (result) => {
    setLabData(prev => ({ ...prev, memory: result }));
    setActiveTab('reaction');
  };

  const saveReactionResult = (trials) => {
    setLabData(prev => ({ ...prev, reaction: trials }));
    setActiveTab('fitts');
  };

  const saveFittsResult = (trials) => {
    setLabData(prev => ({ ...prev, fitts: trials }));
    setActiveTab('typing');
  };

  const saveTypingResult = (result) => {
    setLabData(prev => ({ ...prev, typing: result }));
    setActiveTab('dashboard');
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setIsMenuOpen(false); }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === id
          ? 'bg-slate-900 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      <Icon size={18} />
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">HCI Lab</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem id="home" icon={Info} label="Intro" />
            <NavItem id="memory" icon={Layout} label="Cognitive" />
            <NavItem id="fitts" icon={MousePointer2} label="Input Modality" />
            <NavItem id="dashboard" icon={BarChart3} label="Researcher View" />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-4 flex flex-col gap-2 shadow-xl">
            <NavItem id="home" icon={Info} label="Intro" />
            <NavItem id="memory" icon={Layout} label="Cognitive" />
            <NavItem id="fitts" icon={MousePointer2} label="Input Modality" />
            <NavItem id="dashboard" icon={BarChart3} label="Researcher View" />
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section className="text-center space-y-4 max-w-2xl mx-auto py-12">
              <h2 className="text-4xl font-extrabold text-slate-900">Cognitive & Input Performance Lab</h2>
              <p className="text-lg text-slate-600">
                This environment is designed to measure human-computer interaction metrics through a series of experiments.
                Please proceed through the phases to generate your lab report.
              </p>
              <button
                onClick={() => setActiveTab('memory')}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Start Experiment <ChevronRight size={20} />
              </button>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-blue-500">
                <Brain className="text-blue-500 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Exp 1: Cognitive Processing</h3>
                <p className="text-slate-600 text-sm">
                  Measuring short-term memory recall and stimulus-response latency.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-indigo-500">
                <MousePointer2 className="text-indigo-500 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Exp 2: Input Modality</h3>
                <p className="text-slate-600 text-sm">
                  Benchmarking Fitts's Law performance and keyboard input speed across mouse vs. touch.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'memory' && <MemoryTest onComplete={saveMemoryResult} />}
        {activeTab === 'reaction' && <ReactionTest onComplete={saveReactionResult} />}
        {activeTab === 'fitts' && <FittsTest onComplete={saveFittsResult} />}
        {activeTab === 'typing' && <TypingTest onComplete={saveTypingResult} />}
        {activeTab === 'dashboard' && <Dashboard data={labData} />}
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} HCI Research Lab. Professional Grade Performance Measurement.
      </footer>
    </div>
  );
};

export default App;
