import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, Flame, Maximize2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setActiveGame(null); setSelectedCategory('All'); setSearchQuery(''); }}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              GAMES<span className="text-indigo-500">HUB</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button className="hover:text-white transition-colors">Trending</button>
            <button className="hover:text-white transition-colors">New</button>
            <button className="hover:text-white transition-colors">Multiplayer</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 md:p-12 border border-white/10">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Flame className="w-3 h-3" /> Featured Game
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-4 leading-tight">
                    SLOPE: THE ULTIMATE CHALLENGE
                  </h2>
                  <p className="text-zinc-300 text-lg mb-8">
                    Test your reflexes in this high-speed neon journey. How far can you go without falling?
                  </p>
                  <button 
                    onClick={() => setActiveGame(gamesData.find(g => g.id === 'slope') || null)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    Play Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                  <img 
                    src="https://picsum.photos/seed/slope/800/600" 
                    alt="Slope" 
                    className="w-full h-full object-cover opacity-40 mask-gradient-to-l"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveGame(game)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/10 game-card-hover">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm">
                          Play Now
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                    <p className="text-zinc-500 text-sm">{game.category}</p>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <Search className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No games found</h3>
                  <p className="text-zinc-500">Try searching for something else or check another category.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-12rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to Library
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{activeGame.title}</h2>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 relative group">
                <iframe
                  src={activeGame.url}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={activeGame.title}
                />
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeGame.thumbnail} 
                    alt="" 
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold">{activeGame.title}</h3>
                    <p className="text-zinc-500 text-sm">{activeGame.category} • 1.2M Plays</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-bold text-sm">
                    Favorite
                  </button>
                  <button className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors font-bold text-sm">
                    Share Game
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold tracking-tight">
                GAMES<span className="text-indigo-500">HUB</span>
              </h1>
            </div>
            <p className="text-zinc-500 max-w-md mb-6">
              The ultimate destination for unblocked web games. Play your favorite titles anywhere, anytime, for free. No downloads required.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Categories</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><button className="hover:text-white transition-colors">Action Games</button></li>
              <li><button className="hover:text-white transition-colors">Sports Games</button></li>
              <li><button className="hover:text-white transition-colors">Puzzle Games</button></li>
              <li><button className="hover:text-white transition-colors">Arcade Classics</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><button className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-white transition-colors">Report a Bug</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-zinc-600 text-xs">
          © {new Date().getFullYear()} GamesHub Unblocked. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
