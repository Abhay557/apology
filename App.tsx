
import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from './types';
import FloatingHearts from './components/FloatingHearts';
import { generateApologyMessage } from './services/geminiService';
import { Heart, Sparkles, Send, RefreshCw, X, Share2, Check } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INTRO);
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');
  const [generatedPoem, setGeneratedPoem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonCount, setNoButtonCount] = useState(0);
  const [showCopied, setShowCopied] = useState(false);

  // Handle incoming shared links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedTo = params.get('to');
    const sharedMsg = params.get('msg');

    if (sharedTo && sharedMsg) {
      try {
        setRecipient(sharedTo);
        // Using atob for basic base64 decoding of the shared message
        setGeneratedPoem(decodeURIComponent(escape(window.atob(sharedMsg))));
        setState(AppState.MESSAGE);
      } catch (e) {
        console.error("Failed to decode shared message", e);
      }
    }
  }, []);

  const handleStartApology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !reason) return;

    setIsLoading(true);
    const message = await generateApologyMessage(recipient, reason);
    setGeneratedPoem(message);
    setIsLoading(false);
    setState(AppState.MESSAGE);
  };

  const handleShare = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    // Encode message to base64 for safe URL transmission
    const encodedMsg = window.btoa(unescape(encodeURIComponent(generatedPoem)));
    const shareUrl = `${baseUrl}?to=${encodeURIComponent(recipient)}&msg=${encodedMsg}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const moveNoButton = useCallback(() => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoButtonPos({ x, y });
    setNoButtonCount(prev => prev + 1);
  }, []);

  const reset = () => {
    // Clear URL params on reset
    window.history.replaceState({}, '', window.location.pathname);
    setState(AppState.INTRO);
    setRecipient('');
    setReason('');
    setGeneratedPoem('');
    setNoButtonCount(0);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-pink-50">
      <FloatingHearts />
      
      {/* Container Card */}
      <div className="z-10 w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border-4 border-pink-200 transition-all duration-500 transform hover:scale-[1.01]">
        
        {state === AppState.INTRO && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-700">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-100 p-4 rounded-full animate-bounce">
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 font-cursive leading-tight">
              Oopsie... <br/> Time for an Apology?
            </h1>
            <p className="text-pink-400 font-medium">Let me help you say it in the cutest way possible!</p>
            
            <form onSubmit={handleStartApology} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-pink-700 mb-1">To someone special:</label>
                <input 
                  type="text" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="E.g., My Bestie, Sweetheart..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-pink-700 mb-1">Why are we sorry?</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="I forgot our anniversary, I ate your cake..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:outline-none transition-colors h-24 resize-none"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <>
                    Make it Cute! <Sparkles className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {state === AppState.MESSAGE && (
          <div className="space-y-8 text-center animate-in slide-in-from-bottom-10 duration-700">
            <div className="relative">
              <h2 className="text-6xl font-bold text-pink-600 font-cursive mb-6 animate-pulse">
                I'm Sorry!
              </h2>
              <div className="absolute -top-4 -right-4 animate-spin-slow">
                <Sparkles className="text-yellow-400 w-8 h-8" />
              </div>
            </div>

            <div className="bg-white/50 border-2 border-dashed border-pink-300 p-6 rounded-2xl relative group">
              <p className="text-lg text-pink-700 italic leading-relaxed">
                "{generatedPoem}"
              </p>
              <div className="mt-4 text-right font-cursive text-pink-500">
                — Your favorite human
              </div>
              
              <button 
                onClick={handleShare}
                className="absolute top-2 right-2 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
                title="Copy share link"
              >
                {showCopied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
              </button>
              {showCopied && (
                <span className="absolute -top-8 right-0 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md animate-bounce shadow-sm">
                  Link Copied!
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-pink-600">Will you forgive me, {recipient}? 🥺</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center h-20 relative">
                <button 
                  onClick={() => setState(AppState.FORGIVEN)}
                  className="bg-green-400 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-110 transition-transform z-20"
                >
                  YES! 💖
                </button>
                
                <button 
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  style={noButtonCount > 0 ? {
                    position: 'fixed',
                    left: noButtonPos.x,
                    top: noButtonPos.y,
                    transition: 'all 0.1s ease-out'
                  } : {}}
                  className="bg-gray-200 text-gray-500 px-8 py-3 rounded-full font-bold shadow-sm whitespace-nowrap z-20"
                >
                  {noButtonCount > 5 ? "STILL NO? 😭" : "No 😤"}
                </button>
              </div>
            </div>
          </div>
        )}

        {state === AppState.FORGIVEN && (
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-green-500 font-cursive">
              YAY! Best Day Ever!
            </h1>
            <p className="text-pink-600 text-lg">
              I promise to be on my best behavior from now on! You're the best, {recipient}! 
            </p>
            <div className="flex justify-center gap-2">
              <Heart className="text-pink-500 fill-pink-500 animate-pulse" />
              <Heart className="text-pink-400 fill-pink-400 animate-pulse delay-75" />
              <Heart className="text-pink-300 fill-pink-300 animate-pulse delay-150" />
            </div>
            <button 
              onClick={reset}
              className="mt-8 text-pink-400 hover:text-pink-600 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw size={14} /> Send another one?
            </button>
          </div>
        )}
      </div>

      <footer className="z-10 mt-8 text-pink-300 text-xs font-medium">
        Made with 💖 and a bit of magic
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
