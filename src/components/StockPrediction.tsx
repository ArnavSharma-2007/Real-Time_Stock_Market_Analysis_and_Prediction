import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { StockPrediction as SPType } from '../services/stockService';
import { formatPrice } from '../utils/format';
import { TrendingUp, TrendingDown, Minus, Brain, BarChart2, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

interface StockPredictionProps {
  prediction: SPType;
  symbol: string;
  currentPrice: number;
  currency?: string;
}

export function StockPredictionPanel({ prediction, symbol, currentPrice, currency = 'USD' }: StockPredictionProps) {
  const { points, oneWeek, oneMonth, threeMonths, trend, trendStrength, modelAccuracy, keyFactors } = prediction;
  const fp = (v: number) => formatPrice(v, currency);

  const trendConfig = {
    BULLISH: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30', label: 'Bullish' },
    BEARISH: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/30', label: 'Bearish' },
    NEUTRAL: { icon: Minus, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/30', label: 'Neutral' },
  }[trend];
  const TrendIcon = trendConfig.icon;

  const pctChange = (target: number) => {
    const pct = ((target - currentPrice) / currentPrice) * 100;
    return { text: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`, color: pct >= 0 ? 'text-emerald-400' : 'text-red-400' };
  };

  const chartData = points.map(p => ({
    ...p,
    formattedDate: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    predictedLine: p.isHistorical ? p.predicted : undefined,
    forecastLine: !p.isHistorical ? p.predicted : undefined,
  }));

  const allPrices = points.flatMap(p => [p.predicted, p.bull, p.bear]).filter(Boolean);
  const minP = allPrices.length ? Math.min(...allPrices) * 0.97 : 0;
  const maxP = allPrices.length ? Math.max(...allPrices) * 1.03 : 100;

  const todayIdx = chartData.findIndex(p => !p.isHistorical) - 1;
  const today = todayIdx >= 0 ? chartData[todayIdx] : null;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 border border-blue-500/30 p-2.5 rounded-xl">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white">AI Price Prediction</h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">{symbol}</span>
                {currency !== 'USD' && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">{currency}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Linear regression + technical bias · 90-day forecast</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${trendConfig.bg} ${trendConfig.border}`}>
              <TrendIcon className={`w-4 h-4 ${trendConfig.color}`} />
              <span className={`text-sm font-semibold ${trendConfig.color}`}>{trendConfig.label}</span>
            </div>
            <div className="bg-gray-800 rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-gray-600">Model Accuracy</div>
              <div className="text-sm font-bold text-blue-400">{modelAccuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target cards */}
      <div className="grid grid-cols-3 gap-px bg-gray-800">
        {[
          { label: '7-Day Target', d: oneWeek },
          { label: '30-Day Target', d: oneMonth },
          { label: '90-Day Target', d: threeMonths },
        ].map(({ label, d }) => {
          const ch = pctChange(d.base);
          return (
            <div key={label} className="bg-gray-900 p-4 text-center">
              <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">{label}</div>
              <div className="text-xl font-black text-white">{fp(d.base)}</div>
              <div className={`text-sm font-semibold mt-1 ${ch.color}`}>{ch.text}</div>
              <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                <span className="text-emerald-500">Bull: {fp(d.bull)}</span>
                <span className="text-red-500">Bear: {fp(d.bear)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forecast chart */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-300">Price Forecast Chart</span>
          <span className="text-xs text-gray-600 ml-2">Historical anchor + 90-day projection with confidence bands</span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#1f2937' }}
                interval={Math.floor(chartData.length / 8)}
              />
              <YAxis
                domain={[Math.floor(minP), Math.ceil(maxP)]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => fp(v)}
                width={currency === 'INR' ? 80 : 65}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '10px', boxShadow: '0 20px 25px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#d1d5db', fontWeight: 600, fontSize: 11 }}
                itemStyle={{ fontSize: 11 }}
                formatter={(value: number, name: string) => {
                  if (name === 'predictedLine') return [fp(value), 'Historical'];
                  if (name === 'forecastLine') return [fp(value), 'Base Forecast'];
                  if (name === 'bull') return [fp(value), 'Bull Case'];
                  if (name === 'bear') return [fp(value), 'Bear Case'];
                  return [value, name];
                }}
              />

              <Area type="monotone" dataKey="bull" stroke="none" fill="url(#bullGrad)" fillOpacity={1} />
              <Line type="monotone" dataKey="bull" stroke="#10b981" strokeWidth={1} dot={false} strokeDasharray="4 3" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="bear" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="4 3" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="predictedLine" stroke="#94a3b8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="forecastLine" stroke="#3b82f6" strokeWidth={2.5} dot={false} strokeDasharray="6 2" />

              {today && (
                <ReferenceLine
                  x={today.formattedDate}
                  stroke="#4b5563"
                  strokeDasharray="4 2"
                  label={{ value: 'Today', position: 'insideTopLeft', fill: '#6b7280', fontSize: 10 }}
                />
              )}
              <ReferenceLine y={currentPrice} stroke="#60a5fa" strokeDasharray="3 3" strokeOpacity={0.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
          {[
            { color: '#94a3b8', label: 'Historical' },
            { color: '#3b82f6', label: 'Base Forecast', dash: true },
            { color: '#10b981', label: 'Bull Case', dash: true },
            { color: '#ef4444', label: 'Bear Case', dash: true },
          ].map(({ color, label, dash }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg width="20" height="10">
                <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dash ? '4 2' : undefined} />
              </svg>
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend strength + key factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800">
        <div className="bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-gray-200">Trend Strength</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-3xl font-black ${trendConfig.color}`}>{trendStrength}%</div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${trendConfig.bg} ${trendConfig.border} ${trendConfig.color}`}>
              <TrendIcon className="w-3 h-3" />
              {trendConfig.label}
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${trend === 'BULLISH' ? 'bg-emerald-500' : trend === 'BEARISH' ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${trendStrength}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2">Based on 60-session linear regression + technical bias</div>
        </div>

        <div className="bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-gray-200">Key Factors</span>
          </div>
          <div className="space-y-2">
            {keyFactors.slice(0, 4).map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-950 border-t border-gray-800">
        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
          Prediction uses statistical modeling (linear regression + technical indicators). Not financial advice. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}
