# Indian Stock AI

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://indian-stock-ai.streamlit.app)

An AI-powered Indian stock market analysis dashboard built entirely with **free tools**:
Python · yfinance · Prophet · XGBoost · LSTM · FinBERT · Streamlit · Plotly

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📊 **Live Dashboard** | Candlestick charts, technical signals, sector heatmap, news feed |
| 🔮 **AI Forecast** | Ensemble of Prophet + XGBoost + LSTM with confidence intervals |
| 🔍 **Stock Screener** | Filter Nifty 50 by RSI, MACD, sentiment, sector, return |
| 💰 **Tax Calculator** | STCG/LTCG, STT, cess — FY 2025-26 rules |
| 📰 **Sentiment Analysis** | FinBERT financial sentiment on live news (RSS) |
| ⏱️ **Time Horizon** | 2 days → 2 years forecast range |
| 📈 **Backtesting** | Walk-forward validation with accuracy metrics |

---

## 🚀 Quick Start

### 1. Clone / Open the project

```bash
cd indian-stock-ai
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> **Note:** `prophet` may require extra steps on Windows:
> ```bash
> pip install pystan==2.19.1.1
> pip install prophet
> ```
> If Prophet fails to install, the app falls back to linear regression automatically.

> **Note:** `tensorflow` / `torch` are large packages (~500MB). If you want a lighter install without LSTM/FinBERT:
> ```bash
> pip install yfinance pandas numpy scikit-learn xgboost prophet feedparser streamlit plotly pytz
> ```
> The app degrades gracefully — LSTM falls back to Ridge regression, FinBERT falls back to keyword sentiment.

### 4. Run the app

```bash
streamlit run app.py
```

The app opens at **http://localhost:8501**

---

## 🗂️ Project Structure

```
indian-stock-ai/
├── app.py                      # Main Streamlit entry point
├── config.py                   # Global configuration
├── requirements.txt
│
├── data/
│   ├── fetcher.py              # yfinance OHLCV + info downloader
│   ├── news_fetcher.py         # RSS news (Google News, ET, LiveMint)
│   ├── cache_manager.py        # File-based TTL cache
│   └── stock_universe.py       # Nifty 50 stock list + sector map
│
├── features/
│   ├── technical_indicators.py # RSI, MACD, BB, ATR, ADX, OBV, VWAP…
│   ├── feature_pipeline.py     # ML feature matrix builder
│   └── sentiment_features.py  # FinBERT sentiment scorer
│
├── models/
│   ├── prophet_model.py        # Facebook Prophet wrapper
│   ├── xgboost_model.py        # XGBoost direction classifier
│   ├── lstm_model.py           # Keras LSTM forecaster
│   ├── ensemble.py             # Weighted ensemble combiner
│   └── model_store.py          # Model persistence (pickle + JSON)
│
├── tax/
│   └── indian_tax.py           # STCG/LTCG/STT calculator (FY 2025-26)
│
└── ui/
    ├── components.py           # Shared Plotly charts + CSS + cards
    ├── dashboard.py            # Main dashboard tab
    ├── forecast_view.py        # AI forecast tab
    ├── screener_view.py        # Stock screener tab
    └── tax_view.py             # Tax calculator tab
```

---

## 🧠 AI Models

### Ensemble Weights (by horizon)

| Horizon | Prophet | XGBoost | LSTM |
|---------|---------|---------|------|
| Short (≤5 days) | 20% | 40% | 40% |
| Medium (≤60 days) | 40% | 35% | 25% |
| Long (>60 days) | 50% | 30% | 20% |

Sentiment score from FinBERT adjusts the direction probability by ±3%.

---

## 💰 Indian Tax Rules (FY 2025-26)

| Type | Holding Period | Rate | Exemption |
|------|---------------|------|-----------|
| STCG | < 12 months | 20% | None |
| LTCG | ≥ 12 months | 12.5% | ₹1.25L / year |

- STT: 0.1% on buy + 0.1% on sell (delivery)  
- Cess: 4% on tax amount  
- Source: Union Budget 2024, effective July 23, 2024

---

## ⚠️ Disclaimer

> This tool is for **educational and analytical purposes only**.  
> It is **NOT** financial advice. AI predictions are inherently uncertain.  
> Past performance does not guarantee future results.  
> Always consult a **SEBI-registered financial advisor** before making investment decisions.

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `yfinance` | NSE/BSE stock data |
| `prophet` | Time-series forecasting |
| `xgboost` | Gradient boosting classifier |
| `tensorflow` | LSTM neural network |
| `transformers` | FinBERT sentiment (Hugging Face) |
| `pandas-ta` | Technical indicators |
| `streamlit` | Dashboard UI |
| `plotly` | Interactive charts |
| `feedparser` | RSS news parsing |
