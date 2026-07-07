import { useState, useEffect, useCallback } from 'react';
import {
  StockAnalysis,
  StockData,
  POPULAR_STOCKS,
  INDIA_STOCKS,
  stockService,
} from '../services/stockService';
import { formatPrice, formatVolume, formatMarketCap } from '../utils/format';
import { StockChart } from './StockChart';
import { TechnicalIndicatorsPanel } from './TechnicalIndicators';
import { StockPredictionPanel } from './StockPrediction';
import { IndiaMarketPanel } from './IndiaMarketPanel';
import { StockCard, StockTicker } from './StockCard';
import { StockSearch } from './StockSearch';
import {
  Activity, RefreshCw, Zap, Shield, TrendingUp, TrendingDown,
  Star, Globe, Clock, LayoutDashboard, Landmark,
} from 'lucide-react';

export function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1Y');
  const [viewMode, setViewMode] = useState<'global' | 'india'>('global');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : ['AAPL', 'GOOGL', 'MSFT', 'RELIANCE.NS', 'TCS.NS'];
    } catch {
      return ['AAPL', 'GOOGL', 'MSFT', 'RELIANCE.NS', 'TCS.NS'];
    }
  });
  const [watchlistData, setWatchlistData] = useState<StockData[]>([]);
  const [tickerData, setTickerData] = useState<StockData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'watchlist' | 'india'>('watchlist');

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const loadAnalysis = useCallback(async (symbol: string, range: string) => {
    setLoading(true);
    try {
      const data = await stockService.getFullAnalysis(symbol, range);
      setAnalysis(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalysis(selectedSymbol, timeRange);
  }, [selectedSymbol, timeRange, loadAnalysis]);

  useEffect(() => {
    if (!autoRefresh) return;
    const unsubscribers: (() => void)[] = [];

    watchlist.forEach(symbol => {
      const unsub = stockService.subscribeToUpdates(symbol, data => {
        setWatchlistData(prev => {
          const idx = prev.findIndex(d => d.symbol === data.symbol);
          if (idx >= 0) { const u = [...prev]; u[idx] = data; return u; }
          return [...prev, data];
        });
      });
      unsubscribers.push(unsub);
    });

    const tickerSymbols = [...POPULAR_STOCKS.slice(0, 8), ...INDIA_STOCKS.slice(0, 6)];
    tickerSymbols.forEach(symbol => {
      const unsub = stockService.subscribeToUpdates(symbol, data => {
        setTickerData(prev => {
          const idx = prev.findIndex(d => d.symbol === data.symbol);
          if (idx >= 0) { const u = [...prev]; u[idx] = data; return u; }
          return [...prev, data];
        });
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach(u => u());
  }, [watchlist, autoRefresh]);

  const handleSelectStock = (symbol: string) => setSelectedSymbol(symbol);
  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) setWatchlist(prev => [...prev, symbol]);
  };
  const handleRemoveFromWatchlist = (symbol: string) =>
    setWatchlist(prev => prev.filter(s => s !== symbol));

  const cur = analysis?.stock.currency ?? 'USD';
  const fp = (v: number) => formatPrice(v, cur);

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800/80 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">Stock Analyser AI</h1>
                <p className="text-xs text-gray-600 leading-tight">Made by Arnav Sharma</p>
              </div>
            </div>

            <div className="flex-1 max-w-lg">
              <StockSearch
                onSearch={handleSelectStock}
                watchlist={watchlist}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                currentSymbol={selectedSymbol}
              />
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-xs text-gray-600 hidden sm:flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>{lastUpdate.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  autoRefresh
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Live {autoRefresh ? 'ON' : 'OFF'}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setViewMode('global')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'global'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Global
                </button>
                <button
                  onClick={() => setViewMode('india')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'india'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  India
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker */}
      {tickerData.length > 0 && (
        <StockTicker stocks={tickerData} onSelectStock={handleSelectStock} />
      )}

      <main className="max-w-[1600px] mx-auto px-4 py-5">
        <div className="grid grid-cols-12 gap-5">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden sticky top-[72px]">
              {/* Sidebar tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setSidebarTab('watchlist')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                    sidebarTab === 'watchlist' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Watchlist
                  <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-full">{watchlist.length}</span>
                </button>
                <button
                  onClick={() => setSidebarTab('india')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                    sidebarTab === 'india' ? 'text-orange-400 border-b-2 border-orange-500 bg-orange-500/5' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  India NSE
                </button>
              </div>

              {sidebarTab === 'watchlist' && (
                <div className="p-2 max-h-[380px] overflow-y-auto">
                  {watchlist.length === 0 ? (
                    <div className="py-8 text-center text-gray-600 text-sm">
                      <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No stocks in watchlist
                    </div>
                  ) : watchlist.map(symbol => (
                    <StockCard
                      key={symbol}
                      stock={watchlistData.find(d => d.symbol === symbol) || stockService.generateMockData(symbol)}
                      onClick={() => handleSelectStock(symbol)}
                      isSelected={symbol === selectedSymbol}
                      compact
                    />
                  ))}
                </div>
              )}

              {sidebarTab === 'india' && (
                <div className="p-2 max-h-[380px] overflow-y-auto">
                  {INDIA_STOCKS.slice(0, 20).map(symbol => (
                    <StockCard
                      key={symbol}
                      stock={stockService.generateMockData(symbol)}
                      onClick={() => handleSelectStock(symbol)}
                      isSelected={symbol === selectedSymbol}
                      compact
                    />
                  ))}
                </div>
              )}

              {/* Global Indices */}
              <div className="px-4 py-3 bg-gradient-to-r from-emerald-600/10 to-teal-700/5 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-sm text-white">Global Indices</span>
                </div>
              </div>
              <div className="p-2 max-h-[280px] overflow-y-auto">
                {['^GSPC', '^DJI', '^IXIC', '^FTSE', '^N225', '^HSI', '^NSEI', '^BSESN'].map(symbol => (
                  <StockCard
                    key={symbol}
                    stock={stockService.generateMockData(symbol)}
                    onClick={() => handleSelectStock(symbol)}
                    isSelected={symbol === selectedSymbol}
                    compact
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="col-span-12 lg:col-span-9 space-y-5">
            {/* India Market Section - shown when India mode is active */}
            {viewMode === 'india' && !loading && (
              <IndiaMarketPanel />
            )}

            {/* Global Stock Analysis Section */}
            {viewMode === 'global' && (
              <>
                {loading && !analysis ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-2 border-blue-500/40 animate-ping" style={{ animationDelay: '0.3s' }} />
                        <RefreshCw className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-spin" />
                      </div>
                      <p className="text-gray-500 text-sm">Loading analysis...</p>
                    </div>
                  </div>
                ) : analysis ? (
                  <>
                    {/* Stock Overview */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                              analysis.recommendation.action === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : analysis.recommendation.action === 'SELL'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}>
                              {analysis.recommendation.action}
                            </span>
                            <span className="text-2xl font-black text-white">{analysis.stock.symbol}</span>
                            {cur !== 'USD' && (
                              <span className="px-2 py-0.5 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full">{cur}</span>
                            )}
                        <button
                          onClick={() => watchlist.includes(analysis.stock.symbol) ? handleRemoveFromWatchlist(analysis.stock.symbol) : handleAddToWatchlist(analysis.stock.symbol)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${watchlist.includes(analysis.stock.symbol) ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                        </button>
                        {loading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">{analysis.stock.name}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-black text-white">{fp(analysis.stock.price)}</div>
                      <div className={`flex items-center justify-end gap-1 text-base font-semibold ${analysis.stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {analysis.stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {analysis.stock.change >= 0 ? '+' : ''}{fp(Math.abs(analysis.stock.change))} ({analysis.stock.change >= 0 ? '+' : ''}{analysis.stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-gray-800">
                    {[
                      { label: 'Open', value: fp(analysis.stock.open), color: 'text-gray-300' },
                      { label: 'High', value: fp(analysis.stock.high), color: 'text-emerald-400' },
                      { label: 'Low', value: fp(analysis.stock.low), color: 'text-red-400' },
                      { label: 'Prev Close', value: fp(analysis.stock.previousClose), color: 'text-gray-300' },
                      { label: 'Volume', value: formatVolume(analysis.stock.volume), color: 'text-blue-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-gray-800/60 rounded-xl p-3">
                        <div className="text-xs text-gray-600">{label}</div>
                        <div className={`text-sm font-bold ${color}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <StockChart
                  data={analysis.historical}
                  symbol={analysis.stock.symbol}
                  currency={cur}
                  onRangeChange={setTimeRange}
                  selectedRange={timeRange}
                />

                {/* Technical Analysis */}
                <TechnicalIndicatorsPanel
                  indicators={analysis.indicators}
                  recommendation={analysis.recommendation}
                  currentPrice={analysis.stock.price}
                  currency={cur}
                />

                {/* AI Prediction */}
                <StockPredictionPanel
                  prediction={analysis.prediction}
                  symbol={analysis.stock.symbol}
                  currentPrice={analysis.stock.price}
                  currency={cur}
                />

                {/* Risk + Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-gray-200">Risk Assessment</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Volatility Level</span>
                          <span className={`font-semibold ${analysis.indicators.atr > analysis.stock.price * 0.02 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {analysis.indicators.atr > analysis.stock.price * 0.02 ? 'High' : 'Low'}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${analysis.indicators.atr > analysis.stock.price * 0.02 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((analysis.indicators.atr / analysis.stock.price) * 500, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Market Position</span>
                        <span className={`font-semibold ${analysis.stock.price > analysis.indicators.sma200 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {analysis.stock.price > analysis.indicators.sma200 ? 'Above Trend' : 'Below Trend'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">52-Week Range</span>
                        <span className="font-semibold text-gray-300">
                          {analysis.stock.week52High && analysis.stock.week52Low
                            ? `${fp(analysis.stock.week52Low)} – ${fp(analysis.stock.week52High)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Daily ATR</span>
                        <span className="font-semibold text-gray-300">{fp(analysis.indicators.atr)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-gray-200">Quick Stats</span>
                    </div>
                    <div className="space-y-3">
                      {analysis.stock.marketCap && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Market Cap</span>
                          <span className="font-bold text-gray-200">{formatMarketCap(analysis.stock.marketCap, cur)}</span>
                        </div>
                      )}
                      {analysis.stock.pe && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">P/E Ratio</span>
                          <span className={`font-bold ${analysis.stock.pe < 15 ? 'text-emerald-400' : analysis.stock.pe > 35 ? 'text-red-400' : 'text-gray-200'}`}>
                            {analysis.stock.pe.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Currency</span>
                        <span className="font-bold text-gray-200">{cur}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Analysis Range</span>
                        <span className="font-bold text-gray-200">{timeRange}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Data Points</span>
                        <span className="font-bold text-gray-200">{analysis.historical.length} sessions</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">AI Confidence</span>
                        <span className="font-bold text-blue-400">{analysis.recommendation.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/60 mt-8 py-6">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 font-medium">Stock Analyser AI — Made by Arnav Sharma</p>
          <p className="text-xs text-gray-700 mt-1">Live prices update every 3 seconds.</p>
          <div className="mt-4 max-w-3xl mx-auto bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-3">
            <p className="text-xs text-amber-600/80 leading-relaxed">
              ⚠️ <span className="font-semibold">Disclaimer:</span> This tool is for educational and analytical purposes only. It is NOT financial advice. AI predictions are inherently uncertain and can be wrong. Past performance does not guarantee future results. Always consult a SEBI-registered financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
