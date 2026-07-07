import { TechnicalIndicators as TI, StockRecommendation } from '../services/stockService';
import { formatPrice } from '../utils/format';
import { TrendingUp, TrendingDown, Minus, Activity, Lightbulb, CheckCircle2 } from 'lucide-react';

interface TechnicalIndicatorsProps {
  indicators: TI;
  recommendation: StockRecommendation;
  currentPrice: number;
  currency?: string;
}

export function TechnicalIndicatorsPanel({ indicators, recommendation, currentPrice, currency = 'USD' }: TechnicalIndicatorsProps) {
  const fp = (v: number) => formatPrice(v, currency);

  const getRSIColor = (rsi: number) => rsi < 30 ? 'text-emerald-400' : rsi > 70 ? 'text-red-400' : 'text-blue-400';
  const getRSILabel = (rsi: number) => rsi < 30 ? 'Oversold' : rsi > 70 ? 'Overbought' : 'Neutral';

  const macdSignal = indicators.macd.histogram > 0
    ? { label: 'Bullish', color: 'text-emerald-400' }
    : { label: 'Bearish', color: 'text-red-400' };

  const stochSignal = indicators.stochastic.k < 20
    ? { label: 'Oversold', color: 'text-emerald-400' }
    : indicators.stochastic.k > 80
    ? { label: 'Overbought', color: 'text-red-400' }
    : { label: 'Neutral', color: 'text-blue-400' };

  const ActionIcon = recommendation.action === 'BUY' ? TrendingUp
    : recommendation.action === 'SELL' ? TrendingDown : Minus;

  const actionConfig = {
    BUY: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    SELL: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/20' },
    HOLD: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  }[recommendation.action];

  const scoreBar = (score: number) => {
    const color = score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
    return (
      <div className="flex items-center gap-2 mt-1">
        <div className="h-1.5 flex-1 rounded-full bg-gray-700 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-white font-semibold text-sm w-6 text-right">{score}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Recommendation header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${actionConfig.bg} ${actionConfig.border} shadow-lg ${actionConfig.glow}`}>
              <ActionIcon className={`w-8 h-8 ${actionConfig.text}`} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">AI Recommendation</div>
              <div className={`text-4xl font-black ${actionConfig.text}`}>{recommendation.action}</div>
              <div className="text-sm text-gray-500 mt-0.5">{recommendation.confidence}% confidence</div>
            </div>
          </div>
          <div className="text-right">
            {recommendation.targetPrice && (
              <div className="mb-2">
                <div className="text-xs text-gray-600 uppercase tracking-wider">Target</div>
                <div className="text-xl font-bold text-emerald-400">{fp(recommendation.targetPrice)}</div>
              </div>
            )}
            {recommendation.stopLoss && (
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Stop Loss</div>
                <div className="text-lg font-bold text-red-400">{fp(recommendation.stopLoss)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Technical', score: recommendation.technicalScore },
            { label: 'Fundamental', score: recommendation.fundamentalScore },
            { label: 'Sentiment', score: recommendation.sentimentScore },
          ].map(({ label, score }) => (
            <div key={label} className="bg-gray-800/80 rounded-xl p-3">
              <div className="text-xs text-gray-500">{label}</div>
              {scoreBar(score)}
            </div>
          ))}
        </div>
      </div>

      {/* Analysis reasons */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-gray-200">Analysis Summary</span>
        </div>
        <div className="space-y-2">
          {recommendation.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-gray-200">Technical Indicators</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="text-xs text-gray-600 mb-1">RSI (14)</div>
            <div className={`text-lg font-bold ${getRSIColor(indicators.rsi)}`}>{indicators.rsi.toFixed(2)}</div>
            <div className={`text-xs ${getRSIColor(indicators.rsi)}`}>{getRSILabel(indicators.rsi)}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="text-xs text-gray-600 mb-1">MACD</div>
            <div className={`text-lg font-bold ${macdSignal.color}`}>
              {indicators.macd.histogram > 0 ? '+' : ''}{indicators.macd.histogram.toFixed(2)}
            </div>
            <div className={`text-xs ${macdSignal.color}`}>{macdSignal.label}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="text-xs text-gray-600 mb-1">Stochastic %K</div>
            <div className={`text-lg font-bold ${stochSignal.color}`}>{indicators.stochastic.k.toFixed(2)}</div>
            <div className={`text-xs ${stochSignal.color}`}>{stochSignal.label}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="text-xs text-gray-600 mb-1">ATR (14)</div>
            <div className="text-lg font-bold text-gray-200">{fp(indicators.atr)}</div>
            <div className="text-xs text-gray-600">Volatility</div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="mt-4">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Moving Averages</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'SMA 20', value: indicators.sma20 },
              { label: 'SMA 50', value: indicators.sma50 },
              { label: 'SMA 200', value: indicators.sma200 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-600">{label}</div>
                <div className={`text-sm font-bold ${currentPrice > value ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fp(value)}
                </div>
                <div className={`text-xs ${currentPrice > value ? 'text-emerald-600' : 'text-red-600'}`}>
                  {currentPrice > value ? 'Above' : 'Below'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="mt-4">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Bollinger Bands</div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-xs text-gray-600">Lower</div>
                <div className="text-sm font-bold text-red-400">{fp(indicators.bollingerBands.lower)}</div>
              </div>
              <div className="text-center flex-1 mx-4">
                <div className="text-xs text-gray-600">Middle (SMA20)</div>
                <div className="text-sm font-bold text-gray-300">{fp(indicators.bollingerBands.middle)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600">Upper</div>
                <div className="text-sm font-bold text-emerald-400">{fp(indicators.bollingerBands.upper)}</div>
              </div>
            </div>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-red-500/30 via-gray-600/30 to-emerald-500/30 border border-gray-700">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-lg shadow-blue-400/30"
                style={{
                  left: `${Math.min(Math.max(
                    ((currentPrice - indicators.bollingerBands.lower) /
                    Math.max(indicators.bollingerBands.upper - indicators.bollingerBands.lower, 0.01)) * 100, 2
                  ), 98)}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Oversold</span>
              <span className="text-blue-400 font-medium">Current: {fp(currentPrice)}</span>
              <span>Overbought</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
