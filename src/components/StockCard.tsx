import { StockData } from '../services/stockService';
import { formatPrice, formatVolume, currencySymbol } from '../utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

export function StockCard({ stock, onClick, isSelected, compact }: StockCardProps) {
  const isPositive = stock.change >= 0;
  const cur = stock.currency;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-xl cursor-pointer transition-all mb-1 ${
          isSelected
            ? 'bg-blue-600/20 border border-blue-500/50'
            : 'hover:bg-gray-800 border border-transparent hover:border-gray-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-white text-sm leading-tight truncate">
              {stock.symbol.replace('.NS', '').replace('.BO', '')}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[110px]">{stock.name}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-white text-sm">{formatPrice(stock.price, cur)}</div>
            <div className={`text-xs flex items-center gap-0.5 justify-end ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/10'
          : 'bg-gray-800/60 border border-gray-700/50 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-white">{stock.symbol}</span>
            {cur !== 'USD' && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                {cur}
              </span>
            )}
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isPositive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
              {isPositive ? 'UP' : 'DOWN'}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate mt-0.5">{stock.name}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">{formatPrice(stock.price, cur)}</div>
          <div className={`flex items-center gap-1 justify-end text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{formatPrice(Math.abs(stock.change), cur)}</span>
            <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-700/50">
        {[
          { label: 'Open', value: formatPrice(stock.open, cur), color: 'text-gray-300' },
          { label: 'High', value: formatPrice(stock.high, cur), color: 'text-emerald-400' },
          { label: 'Low', value: formatPrice(stock.low, cur), color: 'text-red-400' },
          { label: 'Volume', value: formatVolume(stock.volume), color: 'text-gray-300' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className="text-xs text-gray-600">{label}</div>
            <div className={`text-sm font-semibold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {stock.marketCap && (
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <span>MCap: {currencySymbol(cur)}{(stock.marketCap / 1e9).toFixed(1)}B</span>
          {stock.pe && <span>P/E: {stock.pe.toFixed(1)}</span>}
          {stock.week52High && stock.week52Low && (
            <span>52W: {formatPrice(stock.week52Low, cur)}-{formatPrice(stock.week52High, cur)}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface StockTickerProps {
  stocks: StockData[];
  onSelectStock: (symbol: string) => void;
}

export function StockTicker({ stocks, onSelectStock }: StockTickerProps) {
  return (
    <div className="overflow-hidden bg-gray-900 border-b border-gray-800 py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stocks, ...stocks].map((stock, idx) => (
          <div
            key={`${stock.symbol}-${idx}`}
            onClick={() => onSelectStock(stock.symbol)}
            className="inline-flex items-center gap-2 mx-5 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <span className="text-gray-300 font-bold text-sm">
              {stock.symbol.replace('.NS', '').replace('.BO', '')}
            </span>
            <span className="text-white text-sm">{formatPrice(stock.price, stock.currency)}</span>
            <span className={`flex items-center gap-0.5 text-xs ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
            <span className="text-gray-700 text-xs ml-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
