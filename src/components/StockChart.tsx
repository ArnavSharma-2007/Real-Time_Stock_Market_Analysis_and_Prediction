import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import { HistoricalData } from '../services/stockService';
import { formatPrice } from '../utils/format';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StockChartProps {
  data: HistoricalData[];
  symbol: string;
  currency?: string;
  onRangeChange?: (range: string) => void;
  selectedRange: string;
}

const TIME_RANGES = ['1W', '1M', '3M', '6M', '1Y', '5Y'];

export function StockChart({ data, symbol, currency = 'USD', onRangeChange, selectedRange }: StockChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);

  const processedData = useMemo(() => {
    const smaArr = (values: number[], period: number): (number | null)[] =>
      values.map((_, i) => {
        if (i < period - 1) return null;
        const s = values.slice(i - period + 1, i + 1);
        return s.reduce((a, b) => a + b, 0) / period;
      });

    const closes = data.map(d => d.close);
    const sma20 = smaArr(closes, 20);
    const sma50 = smaArr(closes, 50);
    return data.map((d, i) => ({
      ...d,
      sma20: sma20[i],
      sma50: sma50[i],
      formattedDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [data]);

  const priceDomain = useMemo(() => {
    if (!data.length) return [0, 100];
    const min = Math.min(...data.map(d => d.low));
    const max = Math.max(...data.map(d => d.high));
    const pad = (max - min) * 0.08;
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [data]);

  const priceChange = useMemo(() => {
    if (data.length < 2) return { value: 0, percent: 0 };
    const first = data[0].close;
    const last = data[data.length - 1].close;
    return { value: last - first, percent: ((last - first) / first) * 100 };
  }, [data]);

  const isPositive = priceChange.value >= 0;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const gradientId = `grad-${symbol}`;
  const lastClose = data[data.length - 1]?.close ?? 0;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{symbol}</span>
              {currency !== 'USD' && (
                <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  {currency}
                </span>
              )}
              <span className="text-sm text-gray-500">Price Chart</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold text-white">{formatPrice(lastClose, currency)}</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}{formatPrice(Math.abs(priceChange.value), currency)} ({priceChange.percent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TIME_RANGES.map(range => (
              <button
                key={range}
                onClick={() => onRangeChange?.(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedRange === range
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-all ${chartType === 'area' ? 'bg-gray-700 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-all ${chartType === 'line' ? 'bg-gray-700 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${showVolume ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
          >
            Volume
          </button>
          <button
            onClick={() => setShowMA(!showMA)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${showMA ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
          >
            MA Lines
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1f2937' }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="price"
                domain={priceDomain}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => formatPrice(v, currency)}
                width={currency === 'INR' ? 80 : 65}
              />
              {showVolume && <YAxis yAxisId="volume" orientation="right" hide />}
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#d1d5db', fontWeight: 600, fontSize: 12 }}
                itemStyle={{ color: '#9ca3af', fontSize: 12 }}
                formatter={(value: number, name: string) => {
                  if (['close', 'open', 'high', 'low'].includes(name)) return [formatPrice(value, currency), name];
                  if (name === 'volume') return [`${(value / 1e6).toFixed(2)}M`, 'Volume'];
                  if (name === 'sma20') return [formatPrice(value, currency), 'SMA 20'];
                  if (name === 'sma50') return [formatPrice(value, currency), 'SMA 50'];
                  return [value, name];
                }}
              />

              {showVolume && <Bar yAxisId="volume" dataKey="volume" fill="#374151" opacity={0.4} barSize={2} />}

              {chartType === 'area' ? (
                <Area yAxisId="price" type="monotone" dataKey="close" stroke={strokeColor} strokeWidth={2} fill={`url(#${gradientId})`} />
              ) : (
                <Line yAxisId="price" type="monotone" dataKey="close" stroke={strokeColor} strokeWidth={2} dot={false} />
              )}

              {showMA && (
                <>
                  <Line yAxisId="price" type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                  <Line yAxisId="price" type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                </>
              )}

              <ReferenceLine yAxisId="price" y={lastClose} stroke={strokeColor} strokeDasharray="3 3" strokeOpacity={0.4} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {showMA && (
          <div className="flex items-center gap-5 mt-3 text-xs">
            {[
              { color: '#f59e0b', label: 'SMA 20' },
              { color: '#8b5cf6', label: 'SMA 50' },
              { color: strokeColor, label: 'Price' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-6 h-0.5" style={{ backgroundColor: color }} />
                <span className="text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
