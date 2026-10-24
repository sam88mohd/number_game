import React, { useState, useEffect } from 'react';
import {
  Volume2, Star, Sparkles,
  HelpCircle, ShieldCheck, ArrowRight, RotateCcw
} from 'lucide-react';

interface NumberItem {
  num: number;
  word: string;
  emoji: string;
  color: string;
}

const NUMBERS: NumberItem[] = [
  { num: 1, word: 'One', emoji: '🍎', color: 'from-red-400 to-rose-500' },
  { num: 2, word: 'Two', emoji: '⭐', color: 'from-amber-400 to-orange-500' },
  { num: 3, word: 'Three', emoji: '🐱', color: 'from-yellow-400 to-amber-500' },
  { num: 4, word: 'Four', emoji: '🎈', color: 'from-emerald-400 to-teal-500' },
  { num: 5, word: 'Five', emoji: '🚗', color: 'from-cyan-400 to-blue-500' },
  { num: 6, word: 'Six', emoji: '🐟', color: 'from-indigo-400 to-violet-500' },
  { num: 7, word: 'Seven', emoji: '🌸', color: 'from-purple-400 to-fuchsia-500' },
  { num: 8, word: 'Eight', emoji: '⚽', color: 'from-pink-400 to-rose-500' },
  { num: 9, word: 'Nine', emoji: '🍦', color: 'from-orange-400 to-amber-600' },
  { num: 10, word: 'Ten', emoji: '🚀', color: 'from-blue-500 to-indigo-600' },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [countedCount, setCountedCount] = useState<number>(0);
  const [praise, setPraise] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [unlockedNum, setUnlockedNum] = useState<number>(1);

  const currentItem = NUMBERS[currentIndex];

  // Speak text helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset counted items when switching numbers
  useEffect(() => {
    setCountedCount(0);
    speakText(`${currentItem.num}. ${currentItem.word} ${currentItem.emoji}s`);
  }, [currentIndex]);

  const handleItemTap = (index: number) => {
    if (index === countedCount) {
      const nextCount = countedCount + 1;
      setCountedCount(nextCount);
      speakText(`${nextCount}`);

      if (nextCount === currentItem.num) {
        // Completed counting this number!
        setStars((prev) => prev + 10);
        setUnlockedNum((prev) => Math.max(prev, currentIndex + 2));
        const praises = ["🎉 Wonderful!", "⭐ Super counter!", "🚀 Awesome job!", "🥳 High five!"];
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        speakText(`Correct! ${currentItem.num} ${currentItem.emoji}!`);

        setTimeout(() => {
          setPraise("");
          if (currentIndex < NUMBERS.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            setCurrentIndex(0); // Loop back or finish
          }
        }, 1800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 text-white flex flex-col items-center justify-between p-6 select-none font-sans">

      {/* Header */}
      <header className="w-full max-w-xl flex flex-row justify-between items-center py-4 px-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔢</span>
          <h1 className="text-2xl font-black tracking-wide text-yellow-300 drop-shadow">123 Count & Play</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-yellow-400 text-yellow-950 px-4 py-1.5 rounded-full font-bold shadow-md text-base">
            <Star className="w-5 h-5 fill-yellow-950 mr-1.5" />
            <span>{stars}</span>
          </div>
          <button
            onClick={() => setShowHelpModal(true)}
            className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition cursor-pointer"
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center relative overflow-hidden my-auto">

        {praise && (
          <div className="absolute inset-0 bg-yellow-300/95 z-20 flex flex-col items-center justify-center animate-bounce">
            <Sparkles className="w-20 h-20 text-orange-500 mb-2" />
            <h2 className="text-4xl font-black text-slate-900">{praise}</h2>
          </div>
        )}

        {/* Counter Info */}
        <div className="w-full flex justify-between items-center mb-4 text-sm font-bold text-slate-400 uppercase tracking-wider">
          <span>Number {currentIndex + 1} of {NUMBERS.length}</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Score: {stars}</span>
        </div>

        {/* Big Number Display */}
        <div
          onClick={() => speakText(`${currentItem.num}`)}
          className={`w-36 h-36 bg-gradient-to-br ${currentItem.color} text-white rounded-3xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition mb-6 border-4 border-white`}
        >
          <span className="text-7xl font-black drop-shadow">{currentItem.num}</span>
          <span className="text-sm font-bold tracking-widest uppercase opacity-90">{currentItem.word}</span>
        </div>

        {/* Instruction */}
        <p className="text-center font-bold text-slate-600 text-sm mb-4">
          Tap the <span className="text-indigo-600 font-ext500 text-lg">{currentItem.emoji}</span> items to count! ({countedCount} / {currentItem.num})
        </p>

        {/* Interactive Counting Grid (Toddler Friendly Tap Items) */}
        <div className="grid grid-cols-5 gap-3 w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 min-h-[130px] items-center justify-center mb-6">
          {Array.from({ length: currentItem.num }).map((_, idx) => {
            const isCounted = idx < countedCount;
            return (
              <button
                key={idx}
                onClick={() => handleItemTap(idx)}
                className={`h-14 rounded-2xl text-3xl flex items-center justify-center transition transform shadow-sm cursor-pointer ${
                  isCounted
                    ? 'bg-emerald-100 border-2 border-emerald-400 scale-90 opacity-60'
                    : 'bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:scale-110 animate-pulse'
                }`}
              >
                {currentItem.emoji}
              </button>
            );
          })}
        </div>

        {/* Audio / Parent Controls */}
        <div className="w-full flex gap-3">
          <button
            onClick={() => speakText(`${currentItem.num} ${currentItem.emoji}`)}
            className="flex-1 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition cursor-pointer"
          >
            <Volume2 className="w-5 h-5" /> Hear Number
          </button>

          <button
            onClick={() => {
              setStars((prev) => prev + 5);
              if (currentIndex < NUMBERS.length - 1) setCurrentIndex(prev => prev + 1);
            }}
            className="py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl font-bold flex items-center justify-center gap-1 text-sm transition cursor-pointer"
            title="Parent Skip"
          >
            <ShieldCheck className="w-5 h-5" /> Skip
          </button>
        </div>

      </main>

      {/* Number Picker Carousel */}
      <div className="w-full max-w-xl my-4 flex gap-2 overflow-x-auto py-2 px-2 shrink-0">
        {NUMBERS.map((item, index) => {
          const isUnlocked = index < unlockedNum;
          const isCurrent = index === currentIndex;
          return (
            <button
              key={item.num}
              disabled={!isUnlocked}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl font-black text-base flex items-center justify-center transition shadow-md ${
                isCurrent
                  ? 'bg-yellow-400 text-slate-900 ring-4 ring-white scale-110'
                  : isUnlocked
                  ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
                  : 'bg-black/20 text-white/40 cursor-not-allowed'
              }`}
            >
              {item.num}
            </button>
          );
        })}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-indigo-600">
              <HelpCircle className="w-7 h-7" /> How to Play
            </h3>
            <ul className="space-y-3 text-sm font-medium text-slate-600 mb-6">
              <li>🔢 **Count Together:** Toddlers tap each floating emoji one by one to practice counting skills (1 to 10).</li>
              <li>🗣️ **Spoken Feedback:** Every tap speaks the number out loud so they learn auditory counting!</li>
              <li>⭐ **Earn Stars:** Completing a number unlocks the next one and awards points.</li>
            </ul>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg transition cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
