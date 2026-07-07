import { useState, useEffect } from 'react';
import {
  NIFTY_SECTORS,
  INDIA_STOCKS,
  stockService,
  StockData,
} from '../services/stockService';
import { formatPrice, currencySymbol } from '../utils/format';
import {
  Landmark, TrendingUp, TrendingDown, Minus, Activity,
  BarChart2, ArrowUpRight, ArrowDownRight, Newspaper,
  Star, Zap, ChevronRight, Minus as Flat,
} from 'lucide-react';

interface SectorPerformance {
  name: string;
  symbol: string;
  change: number;
  price: number;
}

interface StockMover {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  price: number;
}

export function IndiaMarketPanel() {
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [gainers, setGainers] = useState<StockMover[]>([]);
  const [losers, setLosers] = useState<StockMover[]>([]);
  const [niftyData, setNiftyData] = useState<StockData | null>(null);
  const [sensexData, setSensexData] = useState<StockData | null>(null);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'sectors'>('gainers');
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre'>('open');

  useEffect(() => {
    // Generate sector performance
    const sectorList = Object.entries(NIFTY_SECTORS).map(([name, info]) => {
      const data = stockService.generateMockData(info.symbol);
      return {
        name,
        symbol: info.symbol,
        price: data.price,
        change: data.changePercent,
      };
    });
    const sortedByChange = [...sectorList].sort((a, b) => b.change - a.change);
    setSectors(sortedByChange);

    // Generate top gainers/losers
    const indiaStocks = INDIA_STOCKS.map(sym => {
      const data = stockService.generateMockData(sym);
      return {
        symbol: sym,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
      };
    });

    const sorted = [...indiaStocks].sort((a, b) => b.changePercent - a.changePercent);
    setGainers(sorted.slice(0, 12));
    setLosers(sorted.slice(-12).reverse());

    // Index data
    setNiftyData(stockService.generateMockData('^NSEI'));
    setSensexData(stockService.generateMockData('^BSESN'));

    // Market status simulation
    const hour = new Date().getHours();
    const istHour = hour + 5.5; // Approximate IST from UTC
    if (istHour >= 9 && istHour < 15.5) setMarketStatus('open');
    else if (istHour >= 15.5 && istHour < 16) setMarketStatus('pre');
    else setMarketStatus('closed');

    // Subscribe to updates
    const unsubNifty = stockService.subscribeToUpdates('^NSEI', setNiftyData);
    const unsubSensex = stockService.subscribeToUpdates('^BSESN', setSensexData);

    return () => {
      unsubNifty();
      unsubSensex();
    };
  }, []);

  const statusConfig = {
    open: { label: 'Markets Open', color: 'text-emerald-400', bg: 'bg-emerald-500/20', dot: 'bg-emerald-500' },
    closed: { label: 'Markets Closed', color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-500' },
    pre: { label: 'Pre-Market', color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'bg-amber-500' },
  }[marketStatus];

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-orange-600/15 via-amber-600/10 to-orange-600/5 border-b border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 border border-orange-500/30 p-2.5 rounded-xl">
              <Landmark className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">India Market Dashboard</h3>
              <p className="text-xs text-gray-500">NSE & BSE — Live Market Data</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border border-current/20`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
              {statusConfig.label}
            </div>
          </div>
        </div>
      </div>

      {/* Index Cards */}
      <div className="p-4 bg-gray-800/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* NIFTY 50 */}
          {niftyData && (
            <IndexCard
              name="NIFTY 50"
              symbol="^NSEI"
              data={niftyData}
              onSelect={() => {}}
            />
          )}
          {/* SENSEX */}
          {sensexData && (
            <IndexCard
              name="SENSEX"
              symbol="^BSESN"
              data={sensexData}
              onSelect={() => {}}
            />
          )}
          {/* NIFTY Bank */}
          <IndexCard
            name="NIFTY Bank"
            symbol="^NSEBANK"
            data={stockService.generateMockData('^NSEBANK')}
            onSelect={() => {}}
          />
          {/* NIFTY IT */}
          <IndexCard
            name="NIFTY IT"
            symbol="^NIFTY_IT"
            data={stockService.generateMockData('^NIFTY_IT')}
            onSelect={() => {}}
          />
        </div>
      </div>

      {/* Sectors Performance */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-gray-200">NIFTY Sector Heatmap</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {sectors.slice(0, 15).map((sector) => {
            const isPositive = sector.change >= 0;
            const intensity = Math.min(Math.abs(sector.change) / 3, 1);
            const bg = isPositive
              ? `rgba(16, 185, 129, ${0.15 + intensity * 0.35})`
              : `rgba(239, 68, 68, ${0.15 + intensity * 0.35})`;
            const border = isPositive
              ? `rgba(16, 185, 129, ${0.3 + intensity * 0.3})`
              : `rgba(239, 68, 68, ${0.3 + intensity * 0.3})`;

            return (
              <div
                key={sector.symbol}
                className="p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.03]"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <div className="text-xs text-gray-400 font-medium truncate">{sector.name}</div>
                <div className="text-sm font-bold text-white mt-1">{formatPrice(sector.price, 'INR')}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Movers Tabs */}
      <div className="border-t border-gray-800">
        <div className="flex border-b border-gray-800">
          {[
            { id: 'gainers' as const, icon: TrendingUp, label: 'Gainers', count: gainers.length },
            { id: 'losers' as const, icon: TrendingDown, label: 'Losers', count: losers.length },
            { id: 'sectors' as const, icon: BarChart2, label: 'All Sectors', count: sectors.length },
          ].map(({ id, icon: Icon, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-orange-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-full">{count}</span>
            </button>
          ))}
        </div>

        <div className="p-3 max-h-[360px] overflow-y-auto">
          {activeTab === 'gainers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {gainers.map((stock) => (
                <StockMoverCard key={stock.symbol} stock={stock} type="gainer" />
              ))}
            </div>
          )}
          {activeTab === 'losers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {losers.map((stock) => (
                <StockMoverCard key={stock.symbol} stock={stock} type="loser" />
              ))}
            </div>
          )}
          {activeTab === 'sectors' && (
            <div className="space-y-2">
              {sectors.map((sector) => {
                const isPositive = sector.change >= 0;
                return (
                  <div
                    key={sector.symbol}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-gray-200">{sector.name}</div>
                      <div className="text-xs text-gray-600">{sector.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{formatPrice(sector.price, 'INR')}</div>
                      <div className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Index Card Component
function IndexCard({ name, symbol, data, onSelect }: { name: string; symbol: string; data: StockData; onSelect: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div
      onClick={onSelect}
      className="p-3 bg-gray-900 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{name}</div>
        <div className={`text-xs px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="text-lg font-bold text-white mt-1">{formatPrice(data.price, 'INR')}</div>
      <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {formatPrice(Math.abs(data.change), 'INR')}
      </div>
    </div>
  );
}

// Stock Mover Card Component
function StockMoverCard({ stock, type }: { stock: StockMover; type: 'gainer' | 'loser' }) {
  const isPositive = stock.change >= 0;
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div>
          <div className="font-semibold text-sm text-gray-200">
            {stock.symbol.replace('.NS', '')}
          </div>
          <div className="text-xs text-gray-600 truncate max-w-[120px]">{stock.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-white">{formatPrice(stock.price, 'INR')}</div>
        <div className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
