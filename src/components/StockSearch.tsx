import { useState, useEffect, useRef } from 'react';
import { Search, Star, X, TrendingUp, Globe, Landmark, Cpu, BarChart2 } from 'lucide-react';
import {
  POPULAR_STOCKS, INDIA_STOCKS, GLOBAL_INDICES, CRYPTO_SYMBOLS,
  COMMODITY_SYMBOLS, MARKET_SECTORS, STOCK_NAMES,
} from '../services/stockService';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  watchlist: string[];
  onAddToWatchlist: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  currentSymbol: string;
}

const ALL_SYMBOLS = [
  ...new Set([...POPULAR_STOCKS, ...INDIA_STOCKS, ...GLOBAL_INDICES, ...CRYPTO_SYMBOLS, ...COMMODITY_SYMBOLS]),
];

type Tab = 'search' | 'watchlist' | 'sectors' | 'india' | 'global' | 'crypto';

const TABS: { id: Tab; icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'watchlist', icon: Star, label: 'Watch' },
  { id: 'india', icon: Landmark, label: 'India' },
  { id: 'sectors', icon: TrendingUp, label: 'Sectors' },
  { id: 'global', icon: Globe, label: 'Global' },
  { id: 'crypto', icon: Cpu, label: 'Crypto' },
];

const INDEX_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500 · US', '^DJI': 'Dow Jones · US', '^IXIC': 'NASDAQ · US',
  '^RUT': 'Russell 2000 · US', '^FTSE': 'FTSE 100 · UK', '^GDAXI': 'DAX · Germany',
  '^FCHI': 'CAC 40 · France', '^STOXX50E': 'Euro Stoxx 50', '^N225': 'Nikkei 225 · Japan',
  '^HSI': 'Hang Seng · HK', '^KS11': 'KOSPI · Korea', '000001.SS': 'Shanghai · China',
  '^NSEI': 'NIFTY 50 · India', '^BSESN': 'SENSEX · India', '^NSEBANK': 'NIFTY Bank · India',
  '^NIFTY_IT': 'NIFTY IT · India', '^AXJO': 'ASX 200 · Australia', '^GSPTSE': 'TSX · Canada',
  '^BVSP': 'IBOVESPA · Brazil', '^SSMI': 'SMI · Switzerland',
};

export function StockSearch({ onSearch, watchlist, onAddToWatchlist, onRemoveFromWatchlist, currentSymbol }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setFiltered(
        ALL_SYMBOLS.filter(s =>
          s.toLowerCase().includes(q) ||
          (STOCK_NAMES[s] ?? '').toLowerCase().includes(q)
        ).slice(0, 25)
      );
    } else {
      setFiltered(POPULAR_STOCKS.slice(0, 20));
    }
  }, [query]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSelect = (symbol: string) => {
    onSearch(symbol);
    setQuery('');
    setIsOpen(false);
  };

  const SymbolRow = ({ symbol, showStar = true }: { symbol: string; showStar?: boolean }) => (
    <div
      onClick={() => handleSelect(symbol)}
      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
        symbol === currentSymbol ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800 text-gray-200'
      }`}
    >
      <div className="min-w-0">
        <div className="font-bold text-sm truncate">{symbol}</div>
        <div className="text-xs text-gray-600 truncate">{STOCK_NAMES[symbol] ?? ''}</div>
      </div>
      {showStar && (
        <button
          onClick={e => {
            e.stopPropagation();
            watchlist.includes(symbol) ? onRemoveFromWatchlist(symbol) : onAddToWatchlist(symbol);
          }}
          className={`ml-2 p-1.5 rounded-lg flex-shrink-0 transition-all ${
            watchlist.includes(symbol) ? 'bg-amber-400/10 text-amber-400' : 'bg-gray-700 text-gray-500 hover:text-amber-400'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${watchlist.includes(symbol) ? 'fill-current' : ''}`} />
        </button>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search stocks, indices, crypto..."
          className="w-full pl-10 pr-9 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-2xl border border-gray-700 z-50 shadow-2xl shadow-black/60 max-h-[500px] overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-800 flex-shrink-0">
            {TABS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-1 py-2.5 text-xs font-medium transition-colors flex flex-col items-center gap-0.5 ${
                  activeTab === id ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1">
            {activeTab === 'search' && (
              <div className="p-2">
                {filtered.length > 0 ? filtered.map(symbol => (
                  <SymbolRow key={symbol} symbol={symbol} />
                )) : (
                  <div className="p-6 text-center text-gray-600 text-sm">No results for "{query}"</div>
                )}
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="p-2">
                {watchlist.length > 0 ? watchlist.map(symbol => (
                  <div
                    key={symbol}
                    onClick={() => handleSelect(symbol)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      symbol === currentSymbol ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm">{symbol}</div>
                      <div className="text-xs text-gray-600 truncate">{STOCK_NAMES[symbol] ?? ''}</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onRemoveFromWatchlist(symbol); }}
                      className="ml-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-600">
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Watchlist is empty</p>
                    <p className="text-xs mt-1 opacity-50">Star stocks to track them here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'india' && (
              <div className="p-3">
                {Object.entries(MARKET_SECTORS)
                  .filter(([key]) => key.startsWith('India'))
                  .map(([sector, symbols]) => (
                    <div key={sector} className="mb-4">
                      <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">{sector}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {symbols.map(symbol => (
                          <button
                            key={symbol}
                            onClick={() => handleSelect(symbol)}
                            className={`px-2 py-1 text-xs rounded-lg transition-all text-left ${
                              symbol === currentSymbol
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <div className="font-semibold">{symbol.replace('.NS', '')}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                <div className="mt-3 p-2 text-center text-xs text-gray-700">
                  All prices in ₹ INR (NSE listed)
                </div>
              </div>
            )}

            {activeTab === 'sectors' && (
              <div className="p-3">
                {Object.entries(MARKET_SECTORS)
                  .filter(([key]) => !key.startsWith('India') && key !== 'Crypto' && key !== 'Commodities')
                  .map(([sector, symbols]) => (
                    <div key={sector} className="mb-4">
                      <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">{sector}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {symbols.map(symbol => (
                          <button
                            key={symbol}
                            onClick={() => handleSelect(symbol)}
                            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                              symbol === currentSymbol
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {symbol}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'global' && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {GLOBAL_INDICES.map(symbol => (
                  <button
                    key={symbol}
                    onClick={() => handleSelect(symbol)}
                    className={`p-2.5 text-left rounded-xl transition-all ${
                      symbol === currentSymbol
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{symbol}</div>
                    <div className="text-xs text-gray-600 mt-0.5 truncate">{INDEX_LABELS[symbol] ?? STOCK_NAMES[symbol] ?? symbol}</div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'crypto' && (
              <div className="p-3">
                <div className="mb-3">
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Cryptocurrencies</div>
                  <div className="space-y-1">
                    {CRYPTO_SYMBOLS.map(symbol => (
                      <SymbolRow key={symbol} symbol={symbol} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-2">Commodities</div>
                  <div className="space-y-1">
                    {COMMODITY_SYMBOLS.map(symbol => (
                      <SymbolRow key={symbol} symbol={symbol} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
