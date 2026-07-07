import { format, subDays } from 'date-fns';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  currency: string;
  marketCap?: number;
  pe?: number;
  week52High?: number;
  week52Low?: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  bollingerBands: { upper: number; middle: number; lower: number };
  stochastic: { k: number; d: number };
  atr: number;
}

export interface StockRecommendation {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasons: string[];
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  targetPrice?: number;
  stopLoss?: number;
}

export interface PredictionPoint {
  date: string;
  predicted: number;
  bull: number;
  bear: number;
  isHistorical: boolean;
}

export interface StockPrediction {
  points: PredictionPoint[];
  oneWeek: { base: number; bull: number; bear: number };
  oneMonth: { base: number; bull: number; bear: number };
  threeMonths: { base: number; bull: number; bear: number };
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trendStrength: number;
  modelAccuracy: number;
  keyFactors: string[];
}

export interface StockAnalysis {
  stock: StockData;
  historical: HistoricalData[];
  indicators: TechnicalIndicators;
  recommendation: StockRecommendation;
  prediction: StockPrediction;
}

// ─── Stock Metadata ────────────────────────────────────────────────────────────

export const STOCK_NAMES: Record<string, string> = {
  // ── US Large Cap ──────────────────────────────────────────────────────────
  'AAPL': 'Apple Inc.', 'GOOGL': 'Alphabet Inc.', 'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com Inc.', 'META': 'Meta Platforms Inc.', 'NVDA': 'NVIDIA Corporation',
  'TSLA': 'Tesla Inc.', 'JPM': 'JPMorgan Chase & Co.', 'V': 'Visa Inc.',
  'JNJ': 'Johnson & Johnson', 'WMT': 'Walmart Inc.', 'PG': 'Procter & Gamble Co.',
  'MA': 'Mastercard Inc.', 'UNH': 'UnitedHealth Group Inc.', 'HD': 'The Home Depot Inc.',
  'DIS': 'The Walt Disney Company', 'PYPL': 'PayPal Holdings Inc.', 'NFLX': 'Netflix Inc.',
  'INTC': 'Intel Corporation', 'AMD': 'Advanced Micro Devices Inc.',
  'BA': 'The Boeing Company', 'GS': 'Goldman Sachs Group', 'IBM': 'IBM Corporation',
  'CAT': 'Caterpillar Inc.', 'KO': 'The Coca-Cola Company', 'NKE': 'Nike Inc.',
  'MCD': "McDonald's Corporation", 'PFE': 'Pfizer Inc.', 'MRK': 'Merck & Co. Inc.',
  'ABBV': 'AbbVie Inc.', 'XOM': 'Exxon Mobil Corporation', 'CVX': 'Chevron Corporation',
  'T': 'AT&T Inc.', 'VZ': 'Verizon Communications', 'CRM': 'Salesforce Inc.',
  'ADBE': 'Adobe Inc.', 'ORCL': 'Oracle Corporation', 'CSCO': 'Cisco Systems Inc.',
  'QCOM': 'Qualcomm Inc.', 'TXN': 'Texas Instruments Inc.', 'AVGO': 'Broadcom Inc.',
  'COST': 'Costco Wholesale Corporation', 'AMGN': 'Amgen Inc.', 'LLY': 'Eli Lilly and Company',
  'TMO': 'Thermo Fisher Scientific', 'DHR': 'Danaher Corporation', 'NEE': 'NextEra Energy Inc.',
  'RTX': 'RTX Corporation', 'LMT': 'Lockheed Martin Corporation', 'GE': 'GE Aerospace',
  'MMM': '3M Company', 'F': 'Ford Motor Company', 'GM': 'General Motors Company',
  'UBER': 'Uber Technologies Inc.', 'LYFT': 'Lyft Inc.', 'SNAP': 'Snap Inc.',
  'TWTR': 'X Corp (Twitter)', 'SPOT': 'Spotify Technology', 'SHOP': 'Shopify Inc.',
  'SQ': 'Block Inc.', 'COIN': 'Coinbase Global Inc.', 'HOOD': 'Robinhood Markets',
  'RBLX': 'Roblox Corporation', 'ABNB': 'Airbnb Inc.', 'DASH': 'DoorDash Inc.',
  'PLTR': 'Palantir Technologies', 'SNOW': 'Snowflake Inc.', 'DDOG': 'Datadog Inc.',
  'ZM': 'Zoom Video Communications', 'CRWD': 'CrowdStrike Holdings',
  'PANW': 'Palo Alto Networks', 'FTNT': 'Fortinet Inc.', 'NET': 'Cloudflare Inc.',
  'MU': 'Micron Technology Inc.', 'WDC': 'Western Digital Corporation',
  'AMAT': 'Applied Materials Inc.', 'KLAC': 'KLA Corporation', 'LRCX': 'Lam Research Corp.',
  'BRK.B': 'Berkshire Hathaway B', 'BAC': 'Bank of America Corp.', 'WFC': 'Wells Fargo & Co.',
  'C': 'Citigroup Inc.', 'MS': 'Morgan Stanley', 'AXP': 'American Express Co.',
  'BLK': 'BlackRock Inc.', 'SCHW': 'Charles Schwab Corp.',
  // ── UK & European ─────────────────────────────────────────────────────────
  'BP': 'BP p.l.c.', 'SHEL': 'Shell plc', 'VOD': 'Vodafone Group Plc',
  'RIO': 'Rio Tinto Group', 'BHP': 'BHP Group Limited', 'GSK': 'GSK plc',
  'AZN': 'AstraZeneca plc', 'HSBC': 'HSBC Holdings plc', 'STAN': 'Standard Chartered',
  'ASML': 'ASML Holding N.V.', 'SAP': 'SAP SE', 'DB': 'Deutsche Bank AG',
  'UL': 'Unilever plc', 'LVMUY': 'LVMH Moët Hennessy', 'NSRGY': 'Nestlé S.A.',
  'RHHBY': 'Roche Holding AG', 'NVS': 'Novartis AG', 'CSGP': 'CoStar Group',
  'LNVGY': 'Lenovo Group', 'SIEGY': 'Siemens AG',
  // ── Asian Markets ─────────────────────────────────────────────────────────
  'TSM': 'Taiwan Semiconductor Mfg.', 'TM': 'Toyota Motor Corporation',
  'SONY': 'Sony Group Corporation', 'HMC': 'Honda Motor Co.',
  'BABA': 'Alibaba Group Holding', 'JD': 'JD.com Inc.', 'PDD': 'PDD Holdings Inc.',
  'NIO': 'NIO Inc.', 'BIDU': 'Baidu Inc.', 'TCEHY': 'Tencent Holdings Ltd.',
  'XPEV': 'XPeng Inc.', 'LI': 'Li Auto Inc.', 'NTES': 'NetEase Inc.',
  'BILI': 'Bilibili Inc.', 'KWEB': 'KraneShares MSCI China Internet',
  'SE': 'Sea Limited', 'GRAB': 'Grab Holdings', 'GOTO': 'GoTo Group',
  'INFY': 'Infosys Ltd. (ADR)', 'WIT': 'Wipro Ltd. (ADR)', 'HDB': 'HDFC Bank Ltd. (ADR)',
  'IBN': 'ICICI Bank Ltd. (ADR)', 'SIFY': 'Sify Technologies',
  // ── India NSE Stocks ──────────────────────────────────────────────────────
  'RELIANCE.NS': 'Reliance Industries Ltd.', 'TCS.NS': 'Tata Consultancy Services',
  'HDFCBANK.NS': 'HDFC Bank Ltd.', 'ICICIBANK.NS': 'ICICI Bank Ltd.',
  'BHARTIARTL.NS': 'Bharti Airtel Ltd.', 'SBIN.NS': 'State Bank of India',
  'INFOSYS.NS': 'Infosys Ltd.', 'ITC.NS': 'ITC Ltd.',
  'HINDUNILVR.NS': 'Hindustan Unilever Ltd.', 'LT.NS': 'Larsen & Toubro Ltd.',
  'BAJFINANCE.NS': 'Bajaj Finance Ltd.', 'HCLTECH.NS': 'HCL Technologies Ltd.',
  'MARUTI.NS': 'Maruti Suzuki India Ltd.', 'WIPRO.NS': 'Wipro Ltd.',
  'ASIANPAINT.NS': 'Asian Paints Ltd.', 'AXISBANK.NS': 'Axis Bank Ltd.',
  'KOTAKBANK.NS': 'Kotak Mahindra Bank Ltd.', 'TITAN.NS': 'Titan Company Ltd.',
  'SUNPHARMA.NS': 'Sun Pharmaceutical Industries', 'NESTLEIND.NS': 'Nestle India Ltd.',
  'TECHM.NS': 'Tech Mahindra Ltd.', 'DRREDDY.NS': "Dr. Reddy's Laboratories",
  'TATASTEEL.NS': 'Tata Steel Ltd.', 'POWERGRID.NS': 'Power Grid Corp of India',
  'NTPC.NS': 'NTPC Ltd.', 'ONGC.NS': 'Oil and Natural Gas Corporation',
  'ADANIPORTS.NS': 'Adani Ports & SEZ Ltd.', 'ADANIENT.NS': 'Adani Enterprises Ltd.',
  'ADANIGREEN.NS': 'Adani Green Energy Ltd.', 'CIPLA.NS': 'Cipla Ltd.',
  'DIVISLAB.NS': "Divi's Laboratories Ltd.", 'ULTRACEMCO.NS': 'UltraTech Cement Ltd.',
  'BAJAJFINSV.NS': 'Bajaj Finserv Ltd.', 'GRASIM.NS': 'Grasim Industries Ltd.',
  'COALINDIA.NS': 'Coal India Ltd.', 'INDUSINDBK.NS': 'IndusInd Bank Ltd.',
  'JSWSTEEL.NS': 'JSW Steel Ltd.', 'M&M.NS': 'Mahindra & Mahindra Ltd.',
  'TATAMOTORS.NS': 'Tata Motors Ltd.', 'HINDALCO.NS': 'Hindalco Industries Ltd.',
  'VEDL.NS': 'Vedanta Ltd.', 'TATACONSUM.NS': 'Tata Consumer Products',
  'BRITANNIA.NS': 'Britannia Industries Ltd.', 'EICHERMOT.NS': 'Eicher Motors Ltd.',
  'HDFCLIFE.NS': 'HDFC Life Insurance Co.', 'SBILIFE.NS': 'SBI Life Insurance Co.',
  'ICICIPRULI.NS': 'ICICI Prudential Life Insurance', 'APOLLOHOSP.NS': 'Apollo Hospitals',
  'PIDILITIND.NS': 'Pidilite Industries Ltd.', 'DABUR.NS': 'Dabur India Ltd.',
  'MARICO.NS': 'Marico Ltd.', 'BERGEPAINT.NS': 'Berger Paints India Ltd.',
  'MUTHOOTFIN.NS': 'Muthoot Finance Ltd.', 'PAGEIND.NS': 'Page Industries Ltd.',
  'HAVELLS.NS': 'Havells India Ltd.', 'GODREJCP.NS': 'Godrej Consumer Products',
  'BANDHANBNK.NS': 'Bandhan Bank Ltd.', 'FEDERALBNK.NS': 'The Federal Bank Ltd.',
  'IDFCFIRSTB.NS': 'IDFC First Bank Ltd.', 'PNB.NS': 'Punjab National Bank',
  'BANKBARODA.NS': 'Bank of Baroda', 'CANBK.NS': 'Canara Bank',
  'RECLTD.NS': 'REC Ltd.', 'PFC.NS': 'Power Finance Corporation',
  'IRFC.NS': 'Indian Railway Finance Corp.', 'IRCTC.NS': 'IRCTC Ltd.',
  'ZOMATO.NS': 'Zomato Ltd.', 'NYKAA.NS': 'FSN E-Commerce Ventures (Nykaa)',
  'POLICYBZR.NS': 'PB Fintech (PolicyBazaar)', 'PAYTM.NS': 'One 97 Communications (Paytm)',
  'IXIGO.NS': 'Le Travenues Technology (ixigo)', 'OLA.NS': 'Ola Electric Mobility',
  'SWIGGY.NS': 'Bundl Technologies (Swiggy)', 'DMART.NS': 'Avenue Supermarts (DMart)',
  'TRENT.NS': 'Trent Ltd.', 'JUBLFOOD.NS': 'Jubilant FoodWorks',
  'VSTIND.NS': 'VST Industries Ltd.', 'EMAMILTD.NS': 'Emami Ltd.',
  'APOLLOTYRE.NS': 'Apollo Tyres Ltd.', 'MRF.NS': 'MRF Ltd.',
  'BOSCHLTD.NS': 'Bosch Ltd.', 'MOTHERSON.NS': 'Samvardhana Motherson',
  'BAJAJ-AUTO.NS': 'Bajaj Auto Ltd.', 'HEROMOTOCO.NS': 'Hero MotoCorp Ltd.',
  'TVSMOTOR.NS': 'TVS Motor Company Ltd.', 'EXIDEIND.NS': 'Exide Industries Ltd.',
  'HINDPETRO.NS': 'Hindustan Petroleum Corp.', 'BPCL.NS': 'Bharat Petroleum Corp.',
  'IOC.NS': 'Indian Oil Corporation', 'GAIL.NS': 'GAIL (India) Ltd.',
  'PETRONET.NS': 'Petronet LNG Ltd.', 'CONCOR.NS': 'Container Corporation of India',
  'SIEMENS.NS': 'Siemens India Ltd.', 'ABB.NS': 'ABB India Ltd.',
  'LTIM.NS': 'LTIMindtree Ltd.', 'PERSISTENT.NS': 'Persistent Systems Ltd.',
  'MPHASIS.NS': 'Mphasis Ltd.', 'COFORGE.NS': 'Coforge Ltd.',
  'KPIT.NS': 'KPIT Technologies Ltd.', 'ZENSARTECH.NS': 'Zensar Technologies Ltd.',
  // Additional India stocks
  'SHRIRAMFIN.NS': 'Shriram Finance Ltd.', 'JIOFIN.NS': 'Jio Financial Services',
  'AUBANK.NS': 'AU Small Finance Bank', 'UJJIVANSFB.NS': 'Ujjivan Small Finance Bank',
  'ESSEL.NS': 'Essel Propack Ltd.', 'INDIGO.NS': 'InterGlobe Aviation Ltd.',
  'SPICEJET.NS': 'SpiceJet Ltd.', 'INDHOTEL.NS': 'Indian Hotels Company Ltd.',
  'EIHOTEL.NS': 'EIH Ltd.', 'LAOPALA.NS': 'La Opala RG Ltd.',
  'BOROSIL.NS': 'Borosil Ltd.', 'BOROSILRE.NS': 'Borosil Renewables Ltd.',
  'CROMPTON.NS': 'Crompton Greaves Consumer', 'KAJARIA.NS': 'Kajaria Ceramics Ltd.',
  'SYMPHONY.NS': 'Symphony Ltd.', 'WHIRLPOOL.NS': 'Whirlpool of India',
  'TTKPRESTIG.NS': 'TTK Prestige Ltd.', 'VIPIND.NS': 'VIP Industries Ltd.',
  'CENTURYPLY.NS': 'Century Plyboards', 'GREENPLY.NS': 'Greenply Industries',
  'ASTRAL.NS': 'Astral Ltd.', 'PRINCEPIPE.NS': 'Prince Pipes & Fittings',
  'SUPRAJIT.NS': 'Suprajit Engineering Ltd.', 'SONACOMS.NS': 'Sona BLW Precision',
  'RAMMACOCM.NS': 'Ramkrishna Forgings', 'TITANEBEL.NS': 'Titagarh Rail Systems',
  'IRCON.NS': 'IRCON International Ltd.', 'RAILVIKAS.NS': 'Rail Vikas Nigam Ltd.',
  'RITES.NS': 'RITES Ltd.', 'RAILTEL.NS': 'RailTel Corporation of India',
  'CONCOR.NS': 'Container Corporation', 'DELHIVERY.NS': 'Delhivery Ltd.',
  'BLUEDART.NS': 'Blue Dart Express Ltd.', 'TCIEXP.NS': 'Transport Corporation of India',
  'GESHIP.NS': 'Great Eastern Shipping', 'SHIPPING.NS': 'Shreyas Shipping & Logistics',
  'ADANITOTAL.NS': 'Adani Total Gas Ltd.', 'ADANIENSOL.NS': 'Adani Energy Solutions',
  'AWL.NS': 'Adani Wilmar Ltd.', 'NAUKRI.NS': 'Info Edge (India) Ltd.',
  'NEWGEN.NS': 'Newgen Software Technologies', 'MAZDOCK.NS': 'Mazagon Dock Shipbuilders',
  'COCHINSHIP.NS': 'Cochin Shipyard Ltd.', 'HAL.NS': 'Hindustan Aeronautics Ltd.',
  'BEL.NS': 'Bharat Electronics Ltd.', 'BEML.NS': 'Bharat Earth Movers Ltd.',
  'BHEL.NS': 'Bharat Heavy Electricals Ltd.', 'SAIL.NS': 'Steel Authority of India Ltd.',
  'RATNAMANI.NS': 'Ratnamani Metals & Tubes', 'WELCORP.NS': 'Welspun Corp Ltd.',
  'JINDALSTEL.NS': 'Jindal Steel & Power', 'APLAPOLLO.NS': 'APL Apollo Tubes Ltd.',
  'TATASTEEL.NS': 'Tata Steel Ltd.', 'JSWSTEEL.NS': 'JSW Steel Ltd.',
  'LICI.NS': 'Life Insurance Corporation', 'ICICIGI.NS': 'ICICI Lombard General Insurance',
  'GICRE.NS': 'General Insurance Corporation', 'NEWINDIA.NS': 'The New India Assurance',
  'CHOLAFIN.NS': 'Cholamandalam Investment', 'MUTHOOTFIN.NS': 'Muthoot Finance Ltd.',
  'MANAPPURAM.NS': 'Manappuram Finance Ltd.', 'POWERFIN.NS': 'Power Finance Corporation',
  'PFC.NS': 'Power Finance Corporation', 'RECLTD.NS': 'REC Ltd.',
  'NHPC.NS': 'NHPC Ltd.', 'SJVN.NS': 'SJVN Ltd.',
  'NLCINDIA.NS': 'NLC India Ltd.', 'IRFC.NS': 'Indian Railway Finance Corporation',
  'OIL.NS': 'Oil India Ltd.', 'MOIL.NS': 'MOIL Ltd.',
  'NMDC.NS': 'NMDC Ltd.', 'KIOCL.NS': 'KIOCL Ltd.',
  'HUDCO.NS': 'Housing & Urban Development Corp', 'REC.NS': 'Rural Electrification Corp',
  'PNCINFRA.NS': 'PNC Infratech Ltd.', 'KNRCON.NS': 'KNR Constructions Ltd.',
  'DBREALTY.NS': 'DB Realty Ltd.', 'OBEROIRLTY.NS': 'Oberoi Realty Ltd.',
  'PHOENIXLND.NS': 'Phoenix Mills Ltd.', 'BRIGADE.NS': 'Brigade Enterprises',
  'SOBHA.NS': 'Sobha Ltd.', 'GODREJPROP.NS': 'Godrej Properties Ltd.',
  'PRESTIGE.NS': 'Prestige Estates Projects', 'DLF.NS': 'DLF Ltd.',
  'MACHER.NS': 'Machereon Labs Ltd.', 'METROBRAND.NS': 'Metro Brands Ltd.',
  'TRENT.NS': 'Trent Ltd.', 'VMART.NS': 'V-Mart Retail Ltd.',
  'ABFRL.NS': 'Aditya Birla Fashion & Retail', 'TCNSBRANDS.NS': 'TCNS Clothing Ltd.',
  'LAURUSLABS.NS': 'Laurus Labs Ltd.', 'GRANULES.NS': 'Granules India Ltd.',
  'ALKEM.NS': 'Alkem Laboratories Ltd.', 'ABBOTINDIA.NS': 'Abbott India Ltd.',
  'PFIZER.NS': 'Pfizer Ltd.', 'SANOFI.NS': 'Sanofi India Ltd.',
  'GLAND.NS': 'Gland Pharma Ltd.', 'JUBLPHARMA.NS': 'Jubilant Pharmova Ltd.',
  'MANKIND.NS': 'Mankind Pharma Ltd.', 'JBCHEMICAL.NS': 'JB Chemicals & Pharmaceuticals',
  'IPCALAB.NS': 'IPCA Laboratories Ltd.', 'NATCOPHARM.NS': 'Natco Pharma Ltd.',
  'STRIDES.NS': 'Strides Pharma Science Ltd.', 'SHILPA.NS': 'Shilpa Medicare Ltd.',
  'ERIS.NS': 'Eris Lifesciences Ltd.', 'SYNGENE.NS': 'Syngene International Ltd.',
  'BIOCON.NS': 'Biocon Ltd.', 'CONCORCORP.NS': 'Container Corporation of India',
  'ZEE.NS': 'Zee Entertainment Enterprises', 'PVR.NS': 'PVR INOX Ltd.',
  'SUNTV.NS': 'Sun TV Network Ltd.', 'DBCORP.NS': 'DB Corp Ltd.',
  'JAGRAN.NS': 'Jagran Prakashan Ltd.', 'HTMEDIA.NS': 'HT Media Ltd.',
  'TV18BRDCST.NS': 'TV18 Broadcast Ltd.', 'NETWORK18.NS': 'Network18 Media & Investments',
  'NAZARA.NS': 'Nazara Technologies Ltd.', 'EASEMYTRIP.NS': 'Easy Trip Planners Ltd.',
  'INDIAMART.NS': 'IndiaMART InterMESH Ltd.', 'YATRA.NS': 'Yatra Online Ltd.',
  'CREDENTL.NS': 'CreditAccess Grameen Ltd.', 'SPANDAN.NS': 'Spandana Sphoorty Financial',
  'SATIN.NS': 'Satin Creditcare Network Ltd.', 'MUTHOOTMICRO.NS': 'Muthoot Microfin Ltd.',
  'FIVEDOT.NS': 'Five Star Business Finance', 'APTUS.NS': 'Aptus Value Housing Finance',
  'ASAHIINDIA.NS': 'Asahi India Glass Ltd.', 'ATUL.NS': 'Atul Ltd.',
  'BALRAMA.NS': 'Balrampur Chini Mills Ltd.', 'BALAJIAMIN.NS': 'Balaji Amines Ltd.',
  'DEEPAKNTR.NS': 'Deepak Nitrite Ltd.', 'NAVIFLOR.NS': 'Navin Fluorine International',
  'SRF.NS': 'SRF Ltd.', 'PIIND.NS': 'PI Industries Ltd.',
  'COROMANDEL.NS': 'Coromandel International Ltd.', 'GSFC.NS': 'Gujarat State Fertilizers',
  'FERTIL.NS': 'Fertilisers and Chemicals', 'RCF.NS': 'Rashtriya Chemicals and Fertilizers',
  'FACT.NS': 'Fertilizers and Chemicals Travancore', 'MADRAS.NS': 'Madras Fertilizers Ltd.',
  'GNFC.NS': 'Gujarat Narmada Valley Fertilizers', 'NFL.NS': 'National Fertilizers Ltd.',
  'ZUARI.NS': 'Zuari Agro Chemicals Ltd.', 'CHAMBAL.NS': 'Chambal Fertilisers and Chemicals',
  'GSPL.NS': 'Gujarat State Petronet Ltd.', 'IGL.NS': 'Indraprastha Gas Ltd.',
  'MGL.NS': 'Mahanagar Gas Ltd.', 'ATGL.NS': 'Adani Total Gas Ltd.',
  'PETRONET.NS': 'Petronet LNG Ltd.', 'GAILNIDHI.NS': 'GAIL (India) Ltd.',
  'APTRASCO.NS': 'AP Transco Ltd.', 'POWERGRID.NS': 'Power Grid Corporation of India',
  'CESC.NS': 'CESC Ltd.', 'JPPOWER.NS': 'Jaiprakash Power Ventures',
  'ADANIPW.NS': 'Adani Power Ltd.', 'JSWENERGY.NS': 'JSW Energy Ltd.',
  'TATAPOWER.NS': 'Tata Power Company Ltd.', 'NTPCREG.NS': 'NTPC Ltd.',
  'TORNTPOWER.NS': 'Torrent Power Ltd.', 'DAMODARIND.NS': 'Damodar Industries Ltd.',
  'ACC.NS': 'ACC Ltd.', 'AMBUJACEM.NS': 'Ambuja Cements Ltd.',
  'BIRLACORP.NS': 'Birla Corporation Ltd.', 'JKCEMENT.NS': 'JK Cement Ltd.',
  'INDIACEM.NS': 'India Cements Ltd.', 'RAMCOCEM.NS': 'Ramco Cements Ltd.',
  'DCMSRIND.NS': 'Dalmia Bharat Ltd.', 'HEIDELBERG.NS': 'HeidelbergCement India',
  'STARCEMENT.NS': 'Star Cement Ltd.', 'ORIENTCEM.NS': 'Orient Cement Ltd.',
  'MYSORECEM.NS': 'Mysore Cements Ltd.', 'DECCANCE.NS': 'Deccan Cements Ltd.',
  'SHREECEM.NS': 'Shree Cement Ltd.', 'ULTRATECH.NS': 'UltraTech Cement Ltd.',
  'PRSMNNR.NS': 'Prism Johnson Ltd.', 'INDIANHUME.NS': 'Indian Hume Pipe Co.',
  'HINDMONEX.NS': 'Hindustan Monex Ltd.', 'ELECTCAST.NS': 'Electrosteel Castings Ltd.',
  'JINDALSA.W.NS': 'Jindal South West Steel Ltd.', 'BHUSHANSTL.NS': 'Bhushan Steel Ltd.',
  'ELECTSTEEL.NS': 'Electrosteel Steels Ltd.', 'MONNET.NS': 'Monnet Ispat & Energy Ltd.',
  'BHUSAN.NS': 'Bhushan Steel & Power Ltd.', 'JSWHL.NS': 'JSW Holdings Ltd.',
  'TATASTLBSL.NS': 'Tata Steel BSL Ltd.', 'UTTAMG.NS': 'Uttam Galva Steels Ltd.',
  'MAHSEAMLES.NS': 'Maharashtra Seamless Ltd.', 'JINDALPH.NS': 'Jindal Poly films Ltd.',
  'ADANIPORTS.NS': 'Adani Ports & SEZ Ltd.', 'GPPL.NS': 'Gujarat Pipavav Port Ltd.',
  // ── Global Indices ────────────────────────────────────────────────────────
  '^GSPC': 'S&P 500', '^DJI': 'Dow Jones Industrial Average',
  '^IXIC': 'NASDAQ Composite', '^RUT': 'Russell 2000',
  '^FTSE': 'FTSE 100', '^GDAXI': 'DAX (Germany)',
  '^FCHI': 'CAC 40 (France)', '^IBEX': 'IBEX 35 (Spain)',
  '^STOXX50E': 'Euro Stoxx 50', '^AEX': 'AEX (Netherlands)',
  '^N225': 'Nikkei 225 (Japan)', '^N100': 'Nikkei 100',
  '^HSI': 'Hang Seng (Hong Kong)', '^HSCE': 'Hang Seng China Enterprises',
  '^KS11': 'KOSPI (South Korea)', '^KQ11': 'KOSDAQ (South Korea)',
  '^NSEI': 'NIFTY 50 (India)', '^BSESN': 'BSE SENSEX (India)',
  '^NSEBANK': 'NIFTY Bank', '^NIFTY_IT': 'NIFTY IT',
  '^NIFTYAUTO': 'NIFTY Auto', '^NIFTYFMCG': 'NIFTY FMCG',
  '^NIFTYPHARMA': 'NIFTY Pharma', '^NIFTYENERGY': 'NIFTY Energy',
  '^NIFTYINFRA': 'NIFTY Infra', '^NIFTYMETAL': 'NIFTY Metal',
  '^NIFTYREALTY': 'NIFTY Realty', '^NIFTYPSUBANK': 'NIFTY PSU Bank',
  '^NIFTYPVTBANK': 'NIFTY Pvt Bank', '^NIFTYCONSUMP': 'NIFTY Consumer Durables',
  '^NIFTYMEDIA': 'NIFTY Media', '^NIFTYHEALTH': 'NIFTY Healthcare',
  '^NIFTYFIN': 'NIFTY Fin Services',
  '000001.SS': 'Shanghai Composite (China)', '399001.SZ': 'Shenzhen Component (China)',
  '^AXJO': 'ASX 200 (Australia)', '^AORD': 'ASX All Ordinaries',
  '^GSPTSE': 'TSX Composite (Canada)', '^MXX': 'IPC (Mexico)',
  '^BVSP': 'IBOVESPA (Brazil)', '^MERV': 'MERVAL (Argentina)',
  '^SSMI': 'SMI (Switzerland)', '^OMX': 'OMX Stockholm (Sweden)',
  '^OSEBX': 'OBX (Norway)', '^OMXH25': 'OMX Helsinki (Finland)',
  'GC=F': 'Gold Futures', 'SI=F': 'Silver Futures',
  'CL=F': 'Crude Oil (WTI) Futures', 'BZ=F': 'Brent Crude Futures',
  'BTC-USD': 'Bitcoin / USD', 'ETH-USD': 'Ethereum / USD',
  'BNB-USD': 'BNB / USD', 'SOL-USD': 'Solana / USD',
};

// Realistic base prices in native currency
const BASE_PRICES: Record<string, number> = {
  // US Stocks (USD)
  'AAPL': 195, 'GOOGL': 175, 'MSFT': 415, 'AMZN': 195, 'META': 510,
  'NVDA': 875, 'TSLA': 250, 'JPM': 215, 'V': 280, 'JNJ': 155,
  'WMT': 67, 'PG': 165, 'MA': 480, 'UNH': 510, 'HD': 360,
  'DIS': 95, 'PYPL': 62, 'NFLX': 680, 'INTC': 32, 'AMD': 175,
  'BA': 190, 'GS': 480, 'IBM': 195, 'CAT': 350, 'KO': 62,
  'NKE': 80, 'MCD': 285, 'PFE': 27, 'MRK': 125, 'ABBV': 175,
  'XOM': 115, 'CVX': 155, 'T': 17, 'VZ': 40, 'CRM': 295,
  'ADBE': 510, 'ORCL': 140, 'CSCO': 55, 'QCOM': 175, 'TXN': 195,
  'AVGO': 1650, 'COST': 885, 'AMGN': 310, 'LLY': 820, 'TMO': 560,
  'DHR': 250, 'NEE': 73, 'RTX': 115, 'LMT': 510, 'GE': 175,
  'MMM': 100, 'F': 12, 'GM': 47, 'UBER': 82, 'LYFT': 15,
  'SNAP': 14, 'SPOT': 340, 'SHOP': 75, 'SQ': 72, 'COIN': 230,
  'HOOD': 22, 'RBLX': 40, 'ABNB': 145, 'DASH': 120, 'PLTR': 28,
  'SNOW': 155, 'DDOG': 130, 'ZM': 65, 'CRWD': 360, 'PANW': 310,
  'FTNT': 70, 'NET': 100, 'MU': 125, 'AMAT': 220, 'KLAC': 790,
  'LRCX': 980, 'BRK.B': 385, 'BAC': 40, 'WFC': 58, 'C': 65,
  'MS': 105, 'AXP': 235, 'BLK': 870, 'SCHW': 70,
  // UK/Europe ADRs (USD)
  'BP': 35, 'SHEL': 68, 'VOD': 9, 'RIO': 66, 'BHP': 55,
  'GSK': 44, 'AZN': 78, 'HSBC': 44, 'ASML': 870, 'SAP': 235,
  'DB': 16, 'UL': 55, 'LVMUY': 155, 'NSRGY': 110, 'RHHBY': 36,
  'NVS': 102, 'SIEGY': 95, 'INFY': 22, 'WIT': 6, 'HDB': 62,
  'IBN': 27, 'TM': 210, 'SONY': 88, 'HMC': 30, 'TSM': 165,
  'BABA': 85, 'JD': 32, 'PDD': 140, 'NIO': 5, 'BIDU': 95,
  'TCEHY': 43, 'SE': 72, 'GRAB': 4,
  // India NSE (INR)
  'RELIANCE.NS': 2920, 'TCS.NS': 3880, 'HDFCBANK.NS': 1645,
  'ICICIBANK.NS': 1205, 'BHARTIARTL.NS': 1510, 'SBIN.NS': 805,
  'INFOSYS.NS': 1705, 'ITC.NS': 455, 'HINDUNILVR.NS': 2390,
  'LT.NS': 3720, 'BAJFINANCE.NS': 6840, 'HCLTECH.NS': 1710,
  'MARUTI.NS': 12050, 'WIPRO.NS': 470, 'ASIANPAINT.NS': 2790,
  'AXISBANK.NS': 1150, 'KOTAKBANK.NS': 1820, 'TITAN.NS': 3390,
  'SUNPHARMA.NS': 1790, 'NESTLEIND.NS': 2355, 'TECHM.NS': 1655,
  'DRREDDY.NS': 6720, 'TATASTEEL.NS': 163, 'POWERGRID.NS': 328,
  'NTPC.NS': 372, 'ONGC.NS': 288, 'ADANIPORTS.NS': 1390,
  'ADANIENT.NS': 2870, 'ADANIGREEN.NS': 1810, 'CIPLA.NS': 1555,
  'DIVISLAB.NS': 4980, 'ULTRACEMCO.NS': 10500, 'BAJAJFINSV.NS': 1630,
  'GRASIM.NS': 2620, 'COALINDIA.NS': 465, 'INDUSINDBK.NS': 1010,
  'JSWSTEEL.NS': 910, 'M&M.NS': 2980, 'TATAMOTORS.NS': 945,
  'HINDALCO.NS': 680, 'VEDL.NS': 465, 'TATACONSUM.NS': 1130,
  'BRITANNIA.NS': 5350, 'EICHERMOT.NS': 4750, 'HDFCLIFE.NS': 690,
  'SBILIFE.NS': 1580, 'ICICIPRULI.NS': 620, 'APOLLOHOSP.NS': 6980,
  'PIDILITIND.NS': 2950, 'DABUR.NS': 565, 'MARICO.NS': 630,
  'MUTHOOTFIN.NS': 2090, 'PAGEIND.NS': 44500, 'HAVELLS.NS': 1780,
  'GODREJCP.NS': 1240, 'BANDHANBNK.NS': 190, 'FEDERALBNK.NS': 190,
  'IDFCFIRSTB.NS': 82, 'PNB.NS': 108, 'BANKBARODA.NS': 250,
  'CANBK.NS': 112, 'RECLTD.NS': 540, 'PFC.NS': 460,
  'IRFC.NS': 195, 'IRCTC.NS': 875, 'ZOMATO.NS': 240,
  'NYKAA.NS': 185, 'DMART.NS': 4850, 'TRENT.NS': 5800,
  'JUBLFOOD.NS': 640, 'VSTIND.NS': 760, 'MRF.NS': 128000,
  'BOSCHLTD.NS': 36500, 'BAJAJ-AUTO.NS': 9200, 'HEROMOTOCO.NS': 5200,
  'TVSMOTOR.NS': 2400, 'APOLLOTYRE.NS': 520, 'EXIDEIND.NS': 360,
  'HINDPETRO.NS': 390, 'BPCL.NS': 365, 'IOC.NS': 172,
  'GAIL.NS': 218, 'PETRONET.NS': 365, 'CONCOR.NS': 1020,
  'SIEMENS.NS': 7200, 'ABB.NS': 8100, 'LTIM.NS': 5800,
  'PERSISTENT.NS': 5200, 'MPHASIS.NS': 3000, 'COFORGE.NS': 7800,
  'KPIT.NS': 1650, 'ZENSARTECH.NS': 760, 'BERGEPAINT.NS': 590,
  'EMAMILTD.NS': 620, 'LICI.NS': 920, 'MOTHERSON.NS': 200,
  'PAYTM.NS': 810, 'POLICYBZR.NS': 1750,
  // Additional India base prices (no duplicates)
  'SHRIRAMFIN.NS': 2650, 'JIOFIN.NS': 285, 'AUBANK.NS': 785,
  'UJJIVANSFB.NS': 58, 'ESSEL.NS': 215, 'INDIGO.NS': 3980,
  'SPICEJET.NS': 62, 'INDHOTEL.NS': 780, 'EIHOTEL.NS': 385,
  'LAOPALA.NS': 485, 'BOROSIL.NS': 540, 'BOROSILRE.NS': 720,
  'CROMPTON.NS': 485, 'KAJARIA.NS': 1420, 'SYMPHONY.NS': 1380,
  'WHIRLPOOL.NS': 2180, 'TTKPRESTIG.NS': 980, 'VIPIND.NS': 580,
  'CENTURYPLY.NS': 820, 'GREENPLY.NS': 540, 'ASTRAL.NS': 1980,
  'PRINCEPIPE.NS': 780, 'SUPRAJIT.NS': 520, 'SONACOMS.NS': 680,
  'RAMMACOCM.NS': 985, 'TITANEBEL.NS': 1650, 'IRCON.NS': 185,
  'RAILVIKAS.NS': 245, 'RITES.NS': 385, 'RAILTEL.NS': 485,
  'DELHIVERY.NS': 420, 'BLUEDART.NS': 5800, 'TCIEXP.NS': 980,
  'GESHIP.NS': 1280, 'SHIPPING.NS': 420, 'ADANITOTAL.NS': 1150,
  'ADANIENSOL.NS': 1420, 'AWL.NS': 420, 'NAUKRI.NS': 5420,
  'NEWGEN.NS': 1850, 'MAZDOCK.NS': 4520, 'COCHINSHIP.NS': 2150,
  'HAL.NS': 5280, 'BEL.NS': 380, 'BEML.NS': 4850,
  'BHEL.NS': 210, 'SAIL.NS': 142, 'RATNAMANI.NS': 2850,
  'WELCORP.NS': 780, 'JINDALSTEL.NS': 985, 'APLAPOLLO.NS': 1580,
  'ICICIGI.NS': 1820, 'GICRE.NS': 385, 'NEWINDIA.NS': 165,
  'CHOLAFIN.NS': 1380, 'MANAPPURAM.NS': 185, 'POWERFIN.NS': 485,
  'NHPC.NS': 85, 'SJVN.NS': 115, 'NLCINDIA.NS': 280,
  'OIL.NS': 520, 'MOIL.NS': 380, 'NMDC.NS': 225, 'KIOCL.NS': 185,
  'HUDCO.NS': 245, 'PNCINFRA.NS': 420, 'KNRCON.NS': 320,
  'DBREALTY.NS': 185, 'OBEROIRLTY.NS': 1780, 'PHOENIXLND.NS': 2350,
  'BRIGADE.NS': 1380, 'SOBHA.NS': 1420, 'PRESTIGE.NS': 1180,
  'MACHER.NS': 850, 'METROBRAND.NS': 1380, 'VMART.NS': 2950,
  'ABFRL.NS': 285, 'TCNSBRANDS.NS': 720, 'LAURUSLABS.NS': 485,
  'GRANULES.NS': 620, 'ALKEM.NS': 4850, 'ABBOTINDIA.NS': 28500,
  'PFIZER.NS': 5580, 'SANOFI.NS': 7200, 'GLAND.NS': 1680,
  'JUBLPHARMA.NS': 485, 'MANKIND.NS': 2580, 'JBCHEMICAL.NS': 1680,
  'IPCALAB.NS': 1380, 'NATCOPHARM.NS': 1280, 'STRIDES.NS': 420,
  'SHILPA.NS': 585, 'ERIS.NS': 1480, 'SYNGENE.NS': 720, 'BIOCON.NS': 385,
  'ZEE.NS': 145, 'PVR.NS': 1650, 'SUNTV.NS': 780, 'DBCORP.NS': 125,
  'JAGRAN.NS': 115, 'HTMEDIA.NS': 85, 'TV18BRDCST.NS': 45,
  'NETWORK18.NS': 165, 'NAZARA.NS': 780, 'EASEMYTRIP.NS': 58,
  'YATRA.NS': 195, 'CREDENTL.NS': 980, 'SPANDAN.NS': 185,
  'SATIN.NS': 245, 'MUTHOOTMICRO.NS': 125, 'FIVEDOT.NS': 755,
  'APTUS.NS': 385, 'ASAHIINDIA.NS': 585, 'ATUL.NS': 7250,
  'BALRAMA.NS': 520, 'BALAJIAMIN.NS': 3280, 'DEEPAKNTR.NS': 2850,
  'NAVIFLOR.NS': 3850, 'SRF.NS': 2680, 'PIIND.NS': 3680,
  'COROMANDEL.NS': 1780, 'GSFC.NS': 210, 'FERTIL.NS': 115,
  'RCF.NS': 185, 'FACT.NS': 1250, 'MADRAS.NS': 95,
  'GNFC.NS': 720, 'NFL.NS': 95, 'ZUARI.NS': 195, 'CHAMBAL.NS': 385,
  'GSPL.NS': 385, 'IGL.NS': 515, 'MGL.NS': 1250, 'ATGL.NS': 1180,
  'CESC.NS': 145, 'JPPOWER.NS': 18, 'ADANIPW.NS': 585,
  'JSWENERGY.NS': 720, 'TATAPOWER.NS': 420, 'TORNTPOWER.NS': 985,
  'DAMODARIND.NS': 125, 'ACC.NS': 2480, 'AMBUJACEM.NS': 680,
  'BIRLACORP.NS': 1680, 'JKCEMENT.NS': 3420, 'INDIACEM.NS': 285,
  'DCMSRIND.NS': 2180, 'HEIDELBERG.NS': 215, 'STARCEMENT.NS': 155,
  'ORIENTCEM.NS': 285, 'MYSORECEM.NS': 85, 'DECCANCE.NS': 115,
  'SHREECEM.NS': 26800, 'ULTRATECH.NS': 10500, 'PRSMNNR.NS': 420,
  'INDIANHUME.NS': 65, 'HINDMONEX.NS': 195, 'ELECTCAST.NS': 165,
  'JINDALSA.W.NS': 385, 'BHUSHANSTL.NS': 65, 'ELECTSTEEL.NS': 135,
  'MONNET.NS': 28, 'BHUSAN.NS': 55, 'JSWHL.NS': 2180,
  'TATASTLBSL.NS': 125, 'UTTAMG.NS': 12, 'MAHSEAMLES.NS': 980,
  'JINDALPH.NS': 2480, 'GPPL.NS': 185,
  'SHRIRAMFIN.NS': 2650, 'JIOFIN.NS': 285, 'AUBANK.NS': 785,
  'UJJIVANSFB.NS': 58, 'ESSEL.NS': 215, 'INDIGO.NS': 3980,
  'SPICEJET.NS': 62, 'INDHOTEL.NS': 780, 'EIHOTEL.NS': 385,
  'LAOPALA.NS': 485, 'BOROSIL.NS': 540, 'BOROSILRE.NS': 720,
  'CROMPTON.NS': 485, 'KAJARIA.NS': 1420, 'SYMPHONY.NS': 1380,
  'WHIRLPOOL.NS': 2180, 'TTKPRESTIG.NS': 980, 'VIPIND.NS': 580,
  'CENTURYPLY.NS': 820, 'GREENPLY.NS': 540, 'ASTRAL.NS': 1980,
  'PRINCEPIPE.NS': 780, 'SUPRAJIT.NS': 520, 'SONACOMS.NS': 680,
  'RAMMACOCM.NS': 985, 'TITANEBEL.NS': 1650, 'IRCON.NS': 185,
  'RAILVIKAS.NS': 245, 'RITES.NS': 385, 'RAILTEL.NS': 485,
  'DELHIVERY.NS': 420, 'BLUEDART.NS': 5800, 'TCIEXP.NS': 980,
  'GESHIP.NS': 1280, 'SHIPPING.NS': 420, 'ADANITOTAL.NS': 1150,
  'ADANIENSOL.NS': 1420, 'AWL.NS': 420, 'NAUKRI.NS': 5420,
  'NEWGEN.NS': 1850, 'MAZDOCK.NS': 4520, 'COCHINSHIP.NS': 2150,
  'HAL.NS': 5280, 'BEL.NS': 380, 'BEML.NS': 4850,
  'BHEL.NS': 210, 'SAIL.NS': 142, 'RATNAMANI.NS': 2850,
  'WELCORP.NS': 780, 'JINDALSTEL.NS': 985, 'APLAPOLLO.NS': 1580,
  'LICI.NS': 920, 'ICICIGI.NS': 1820, 'GICRE.NS': 385,
  'NEWINDIA.NS': 165, 'CHOLAFIN.NS': 1380, 'MANAPPURAM.NS': 185,
  'POWERFIN.NS': 485, 'NHPC.NS': 85, 'SJVN.NS': 115,
  'NLCINDIA.NS': 280, 'OIL.NS': 520, 'MOIL.NS': 380,
  'NMDC.NS': 225, 'KIOCL.NS': 185, 'HUDCO.NS': 245,
  'PNCINFRA.NS': 420, 'KNRCON.NS': 320, 'DBREALTY.NS': 185,
  'OBEROIRLTY.NS': 1780, 'PHOENIXLND.NS': 2350, 'BRIGADE.NS': 1380,
  'SOBHA.NS': 1420, 'PRESTIGE.NS': 1180, 'MACHER.NS': 850,
  'METROBRAND.NS': 1380, 'VMART.NS': 2950, 'ABFRL.NS': 285,
  'TCNSBRANDS.NS': 720, 'LAURUSLABS.NS': 485, 'GRANULES.NS': 620,
  'ALKEM.NS': 4850, 'ABBOTINDIA.NS': 28500, 'PFIZER.NS': 5580,
  'SANOFI.NS': 7200, 'GLAND.NS': 1680, 'JUBLPHARMA.NS': 485,
  'MANKIND.NS': 2580, 'JBCHEMICAL.NS': 1680, 'IPCALAB.NS': 1380,
  'NATCOPHARM.NS': 1280, 'STRIDES.NS': 420, 'SHILPA.NS': 585,
  'ERIS.NS': 1480, 'SYNGENE.NS': 720, 'BIOCON.NS': 385,
  'ZEE.NS': 145, 'PVR.NS': 1650, 'SUNTV.NS': 780,
  'DBCORP.NS': 125, 'JAGRAN.NS': 115, 'HTMEDIA.NS': 85,
  'TV18BRDCST.NS': 45, 'NETWORK18.NS': 165, 'NAZARA.NS': 780,
  'EASEMYTRIP.NS': 58, 'YATRA.NS': 195, 'CREDENTL.NS': 980,
  'SPANDAN.NS': 185, 'SATIN.NS': 245, 'MUTHOOTMICRO.NS': 125,
  'FIVEDOT.NS': 755, 'APTUS.NS': 385, 'ASAHIINDIA.NS': 585,
  'ATUL.NS': 7250, 'BALRAMA.NS': 520, 'BALAJIAMIN.NS': 3280,
  'DEEPAKNTR.NS': 2850, 'NAVIFLOR.NS': 3850, 'SRF.NS': 2680,
  'PIIND.NS': 3680, 'COROMANDEL.NS': 1780, 'GSFC.NS': 210,
  'FERTIL.NS': 115, 'RCF.NS': 185, 'FACT.NS': 1250,
  'MADRAS.NS': 95, 'GNFC.NS': 720, 'NFL.NS': 95,
  'ZUARI.NS': 195, 'CHAMBAL.NS': 385, 'GSPL.NS': 385,
  'IGL.NS': 515, 'MGL.NS': 1250, 'ATGL.NS': 1180,
  'CESC.NS': 145, 'JPPOWER.NS': 18, 'ADANIPW.NS': 585,
  'JSWENERGY.NS': 720, 'TATAPOWER.NS': 420, 'TORNTPOWER.NS': 985,
  'DAMODARIND.NS': 125, 'ACC.NS': 2480, 'AMBUJACEM.NS': 680,
  'BIRLACORP.NS': 1680, 'JKCEMENT.NS': 3420, 'INDIACEM.NS': 285,
  'RAMCOCEM.NS': 968, 'DCMSRIND.NS': 2180, 'HEIDELBERG.NS': 215,
  'STARCEMENT.NS': 155, 'ORIENTCEM.NS': 285, 'MYSORECEM.NS': 85,
  'DECCANCE.NS': 115, 'SHREECEM.NS': 26800, 'ULTRATECH.NS': 10500,
  'PRSMNNR.NS': 420, 'INDIANHUME.NS': 65, 'HINDMONEX.NS': 195,
  'ELECTCAST.NS': 165, 'JINDALSA.W.NS': 385, 'BHUSHANSTL.NS': 65,
  'ELECTSTEEL.NS': 135, 'MONNET.NS': 28, 'BHUSAN.NS': 55,
  'JSWHL.NS': 2180, 'TATASTLBSL.NS': 125, 'UTTAMG.NS': 12,
  'MAHSEAMLES.NS': 980, 'JINDALPH.NS': 2480, 'GPPL.NS': 185,
  // Crypto & Commodities
  'BTC-USD': 68000, 'ETH-USD': 3800, 'BNB-USD': 590, 'SOL-USD': 175,
  'GC=F': 2320, 'SI=F': 28, 'CL=F': 82, 'BZ=F': 86,
  // Global Index base levels
  '^GSPC': 5300, '^DJI': 39500, '^IXIC': 16800, '^RUT': 2050,
  '^FTSE': 8200, '^GDAXI': 18500, '^FCHI': 8100, '^N225': 38500,
  '^HSI': 17500, '^KS11': 2700, '^NSEI': 22500, '^BSESN': 74000,
  '^NSEBANK': 48000, '^NIFTY_IT': 38000, '^AXJO': 7800, '^GSPTSE': 21800,
  '^STOXX50E': 4900, '^BVSP': 128000, '000001.SS': 3100,
  // NIFTY Sector Indices
  '^NIFTYAUTO': 22000, '^NIFTYFMCG': 52000, '^NIFTYPHARMA': 18500,
  '^NIFTYENERGY': 32000, '^NIFTYINFRA': 8500, '^NIFTYMETAL': 8200,
  '^NIFTYREALTY': 850, '^NIFTYPSUBANK': 6800, '^NIFTYPVTBANK': 25000,
  '^NIFTYCONSUMP': 42000, '^NIFTYMEDIA': 1800, '^NIFTYHEALTH': 14000,
  '^NIFTYFIN': 24000,
};

// Currency per symbol
const CURRENCY_MAP: Record<string, string> = {
  // US-listed stocks → USD
  'USD_DEFAULT': 'USD',
};

// Determine currency from symbol pattern
function getCurrency(symbol: string): string {
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) return 'INR';
  if (symbol.endsWith('.L')) return 'GBP';
  if (symbol.endsWith('.PA') || symbol.endsWith('.DE') || symbol.endsWith('.AS') || symbol.endsWith('.MI')) return 'EUR';
  if (symbol.endsWith('.T')) return 'JPY';
  if (symbol.endsWith('.KS') || symbol.endsWith('.KQ')) return 'KRW';
  if (symbol.endsWith('.HK')) return 'HKD';
  if (symbol.endsWith('.AX')) return 'AUD';
  if (symbol.endsWith('.TO')) return 'CAD';
  if (symbol.endsWith('.SW')) return 'CHF';
  if (symbol.startsWith('^NSEI') || symbol.startsWith('^BSESN') || symbol.includes('NIFTY') || symbol.startsWith('^NSEBANK')) return 'INR';
  if (symbol.startsWith('^FTSE') || symbol.endsWith('.L')) return 'GBP';
  if (symbol === 'GC=F' || symbol === 'SI=F' || symbol === 'CL=F' || symbol === 'BZ=F') return 'USD';
  return 'USD';
}

export class StockService {
  private subscribers: Map<string, Set<(data: StockData) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  generateMockData(symbol: string): StockData {
    const seed = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const sin = (x: number) => Math.sin(seed * x) * 0.5 + 0.5;

    const baseFromSeed = Math.pow(10, 1.5 + sin(1) * 2.5);
    const base = BASE_PRICES[symbol] ?? baseFromSeed;
    const volatility = 0.015 + sin(2) * 0.025;
    const change = (Math.random() - 0.5) * volatility * base * 2;

    const price = Math.max(base * 0.5, base + change);
    const high = price * (1 + Math.random() * volatility * 0.8);
    const low = price * (1 - Math.random() * volatility * 0.8);
    const currency = getCurrency(symbol);

    return {
      symbol,
      name: STOCK_NAMES[symbol] || `${symbol}`,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round((change / base) * 10000) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      open: Math.round((price - change * (0.3 + sin(3) * 0.4)) * 100) / 100,
      previousClose: Math.round((price - change) * 100) / 100,
      volume: Math.round((1e5 + sin(4) * 5e7) * (1 + Math.random())),
      currency,
      marketCap: Math.round(base * (1e6 + sin(5) * 1e9)),
      pe: symbol.endsWith('.NS') || symbol.endsWith('.BO')
        ? Math.round((12 + sin(6) * 50) * 10) / 10
        : Math.round((8 + sin(6) * 45) * 10) / 10,
      week52High: Math.round(base * 1.35 * 100) / 100,
      week52Low: Math.round(base * 0.65 * 100) / 100,
    };
  }

  generateHistoricalData(symbol: string, days: number = 365): HistoricalData[] {
    const data: HistoricalData[] = [];
    const seed = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const base = BASE_PRICES[symbol] ?? Math.pow(10, 1.5 + (Math.sin(seed) * 0.5 + 0.5) * 2.5);

    let price = base * (0.82 + Math.random() * 0.36);
    const volatility = 0.008 + Math.abs(Math.sin(seed * 2)) * 0.018;
    const trend = (Math.random() - 0.42) * 0.0008;

    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const noise = (Math.random() - 0.5) * volatility * price * 2;
      price = price * (1 + trend) + noise;
      price = Math.max(price, base * 0.25);

      const dv = volatility * (0.5 + Math.random());
      const high = price * (1 + dv * Math.random());
      const low = price * (1 - dv * Math.random());
      const open = low + Math.random() * (high - low);

      data.push({
        date: format(date, 'yyyy-MM-dd'),
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(price * 100) / 100,
        volume: Math.round((1e5 + Math.random() * 5e7) * (1 + Math.random() * 0.5)),
      });
    }

    return data;
  }

  calculateTechnicalIndicators(historical: HistoricalData[]): TechnicalIndicators {
    const closes = historical.map(d => d.close);
    const highs = historical.map(d => d.high);
    const lows = historical.map(d => d.low);

    const sma = (data: number[], period: number): number => {
      if (data.length < period) return data[data.length - 1] ?? 0;
      const slice = data.slice(-period);
      return slice.reduce((a, b) => a + b, 0) / period;
    };

    const ema = (data: number[], period: number): number => {
      if (data.length < period) return data[data.length - 1] ?? 0;
      const k = 2 / (period + 1);
      let val = sma(data.slice(0, period), period);
      for (let i = period; i < data.length; i++) {
        val = data[i] * k + val * (1 - k);
      }
      return val;
    };

    const rsi = (data: number[], period: number = 14): number => {
      if (data.length < period + 1) return 50;
      let gains = 0, losses = 0;
      for (let i = data.length - period; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) return 100;
      return 100 - 100 / (1 + avgGain / avgLoss);
    };

    const macdCalc = () => {
      const e12 = ema(closes, 12);
      const e26 = ema(closes, 26);
      const macdValue = e12 - e26;
      const signal = ema(closes.map((_, i) => {
        const slice = closes.slice(0, i + 1);
        return ema(slice, 12) - ema(slice, 26);
      }).filter(v => !isNaN(v)), 9);
      return {
        value: Math.round(macdValue * 100) / 100,
        signal: Math.round(signal * 100) / 100,
        histogram: Math.round((macdValue - signal) * 100) / 100,
      };
    };

    const stochasticCalc = (period = 14) => {
      if (highs.length < period) return { k: 50, d: 50 };
      const recentHighs = highs.slice(-period);
      const recentLows = lows.slice(-period);
      const highestHigh = Math.max(...recentHighs);
      const lowestLow = Math.min(...recentLows);
      const currentClose = closes[closes.length - 1];
      if (highestHigh === lowestLow) return { k: 50, d: 50 };
      const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
      return { k: Math.round(k * 100) / 100, d: Math.round((k * 0.67 + 50 * 0.33) * 100) / 100 };
    };

    const atrCalc = (period = 14): number => {
      if (closes.length < period + 1) return 0;
      const trValues: number[] = [];
      for (let i = 1; i < closes.length; i++) {
        trValues.push(Math.max(
          highs[i] - lows[i],
          Math.abs(highs[i] - closes[i - 1]),
          Math.abs(lows[i] - closes[i - 1])
        ));
      }
      return sma(trValues, period);
    };

    const stdDev = (data: number[], period: number): number => {
      if (data.length < period) return 0;
      const slice = data.slice(-period);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      return Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period);
    };

    const sma20 = sma(closes, 20);
    const sd20 = stdDev(closes, 20);

    return {
      rsi: Math.round(rsi(closes) * 100) / 100,
      macd: macdCalc(),
      sma20: Math.round(sma20 * 100) / 100,
      sma50: Math.round(sma(closes, 50) * 100) / 100,
      sma200: Math.round(sma(closes, 200) * 100) / 100,
      ema12: Math.round(ema(closes, 12) * 100) / 100,
      ema26: Math.round(ema(closes, 26) * 100) / 100,
      bollingerBands: {
        upper: Math.round((sma20 + 2 * sd20) * 100) / 100,
        middle: Math.round(sma20 * 100) / 100,
        lower: Math.round((sma20 - 2 * sd20) * 100) / 100,
      },
      stochastic: stochasticCalc(),
      atr: Math.round(atrCalc() * 100) / 100,
    };
  }

  generateRecommendation(stock: StockData, historical: HistoricalData[], indicators: TechnicalIndicators): StockRecommendation {
    const reasons: string[] = [];
    let technicalScore = 50;
    let fundamentalScore = 50;
    const currentPrice = stock.price;

    if (indicators.rsi < 30) {
      technicalScore += 15;
      reasons.push(`RSI (${indicators.rsi.toFixed(1)}) signals oversold — potential reversal`);
    } else if (indicators.rsi > 70) {
      technicalScore -= 15;
      reasons.push(`RSI (${indicators.rsi.toFixed(1)}) signals overbought — watch for correction`);
    } else {
      reasons.push(`RSI (${indicators.rsi.toFixed(1)}) in neutral territory`);
    }

    if (indicators.macd.histogram > 0) {
      technicalScore += 10;
      reasons.push('MACD histogram positive — bullish momentum');
    } else {
      technicalScore -= 10;
      reasons.push('MACD histogram negative — bearish momentum');
    }

    if (currentPrice > indicators.sma20 && currentPrice > indicators.sma50) {
      technicalScore += 15;
      reasons.push('Price above SMA20 & SMA50 — bullish short-term trend');
    } else if (currentPrice < indicators.sma20 && currentPrice < indicators.sma50) {
      technicalScore -= 15;
      reasons.push('Price below SMA20 & SMA50 — bearish short-term trend');
    }

    if (currentPrice > indicators.sma200) {
      technicalScore += 10;
      reasons.push('Price above SMA200 — confirmed long-term uptrend');
    } else {
      technicalScore -= 10;
      reasons.push('Price below SMA200 — long-term downtrend in place');
    }

    if (indicators.stochastic.k < 20) {
      technicalScore += 10;
      reasons.push('Stochastic %K oversold — momentum reversal likely');
    } else if (indicators.stochastic.k > 80) {
      technicalScore -= 10;
      reasons.push('Stochastic %K overbought — near-term pullback risk');
    }

    if (stock.pe && stock.pe < 15) {
      fundamentalScore += 15;
      reasons.push(`P/E ${stock.pe} — stock appears undervalued vs peers`);
    } else if (stock.pe && stock.pe > 35) {
      fundamentalScore -= 10;
      reasons.push(`P/E ${stock.pe} — premium valuation, growth priced in`);
    }

    const recentReturns = historical.length > 30
      ? (historical[historical.length - 1].close / historical[historical.length - 31].close - 1) * 100
      : 0;

    if (recentReturns > 20) {
      technicalScore -= 10;
      reasons.push(`Strong 30-day gain (${recentReturns.toFixed(1)}%) — potential pullback risk`);
    } else if (recentReturns < -20) {
      technicalScore += 10;
      reasons.push(`30-day pullback (${recentReturns.toFixed(1)}%) — potential bounce opportunity`);
    } else {
      reasons.push(`30-day performance: ${recentReturns >= 0 ? '+' : ''}${recentReturns.toFixed(1)}%`);
    }

    technicalScore = Math.max(0, Math.min(100, technicalScore));
    fundamentalScore = Math.max(0, Math.min(100, fundamentalScore));
    const sentimentScore = technicalScore * 0.6 + fundamentalScore * 0.4;
    const avgScore = (technicalScore + fundamentalScore + sentimentScore) / 3;

    const action: 'BUY' | 'SELL' | 'HOLD' = avgScore >= 65 ? 'BUY' : avgScore <= 35 ? 'SELL' : 'HOLD';
    const confidence = Math.round(action === 'HOLD' ? 50 + Math.abs(avgScore - 50) : action === 'BUY' ? avgScore : 100 - avgScore);
    const targetPrice = action === 'BUY' ? Math.round(currentPrice * 1.15 * 100) / 100 : action === 'SELL' ? Math.round(currentPrice * 0.9 * 100) / 100 : currentPrice;
    const stopLoss = action === 'BUY' ? Math.round(currentPrice * 0.95 * 100) / 100 : undefined;

    return { action, confidence, reasons, technicalScore: Math.round(technicalScore), fundamentalScore: Math.round(fundamentalScore), sentimentScore: Math.round(sentimentScore), targetPrice, stopLoss };
  }

  generatePrediction(historical: HistoricalData[], indicators: TechnicalIndicators, _recommendation: StockRecommendation): StockPrediction {
    const closes = historical.map(d => d.close);
    const n = closes.length;
    const lastClose = closes[n - 1] ?? 100;

    if (n < 10) {
      return {
        points: [],
        oneWeek: { base: lastClose, bull: lastClose * 1.05, bear: lastClose * 0.95 },
        oneMonth: { base: lastClose, bull: lastClose * 1.1, bear: lastClose * 0.9 },
        threeMonths: { base: lastClose, bull: lastClose * 1.2, bear: lastClose * 0.8 },
        trend: 'NEUTRAL', trendStrength: 50, modelAccuracy: 60, keyFactors: [],
      };
    }

    const window = Math.min(60, n);
    const slice = closes.slice(-window);
    const xMean = (window - 1) / 2;
    const yMean = slice.reduce((a, b) => a + b, 0) / window;
    let num = 0, den = 0;
    slice.forEach((y, i) => { num += (i - xMean) * (y - yMean); den += (i - xMean) ** 2; });
    const slope = den === 0 ? 0 : num / den;

    const dailyVolatility = Math.max(0.001, indicators.atr / lastClose);
    let biasFactor = 0;
    if (indicators.rsi < 40) biasFactor += 0.001;
    if (indicators.rsi > 60) biasFactor -= 0.001;
    if (indicators.macd.histogram > 0) biasFactor += 0.001;
    else biasFactor -= 0.001;
    if (lastClose > indicators.sma50) biasFactor += 0.0005;
    else biasFactor -= 0.0005;

    const dailyTrend = slope / lastClose + biasFactor;
    const trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = dailyTrend > 0.0008 ? 'BULLISH' : dailyTrend < -0.0008 ? 'BEARISH' : 'NEUTRAL';
    const trendStrength = Math.min(100, Math.round(Math.abs(dailyTrend) * 100000));
    const modelAccuracy = Math.max(40, Math.min(85, Math.round(65 + (1 - dailyVolatility * 10) * 20)));

    const anchorDays = 14;
    const futureDays = 90;
    const points: PredictionPoint[] = [];

    for (let i = anchorDays - 1; i >= 0; i--) {
      const idx = n - 1 - i;
      if (idx >= 0) {
        points.push({ date: historical[idx].date, predicted: closes[idx], bull: closes[idx], bear: closes[idx], isHistorical: true });
      }
    }

    let pred = lastClose;
    for (let d = 1; d <= futureDays; d++) {
      pred = pred * (1 + dailyTrend);
      const uncertainty = dailyVolatility * Math.sqrt(d) * lastClose;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + d);
      points.push({
        date: format(futureDate, 'yyyy-MM-dd'),
        predicted: Math.round(pred * 100) / 100,
        bull: Math.round((pred + uncertainty * 1.5) * 100) / 100,
        bear: Math.round(Math.max(pred - uncertainty * 1.5, pred * 0.3) * 100) / 100,
        isHistorical: false,
      });
    }

    const futurePoints = points.filter(p => !p.isHistorical);
    const at = (days: number) => {
      const t = futurePoints[Math.min(days - 1, futureDays - 1)];
      return t ? { base: t.predicted, bull: t.bull, bear: t.bear } : { base: lastClose, bull: lastClose, bear: lastClose };
    };

    const keyFactors: string[] = [];
    if (trend === 'BULLISH') keyFactors.push('Positive linear trend momentum over past 60 sessions');
    else if (trend === 'BEARISH') keyFactors.push('Negative linear trend momentum over past 60 sessions');
    else keyFactors.push('Sideways momentum — no clear directional bias in regression');
    if (indicators.rsi < 40) keyFactors.push('Oversold RSI conditions suggest potential upside');
    else if (indicators.rsi > 60) keyFactors.push('Elevated RSI may signal near-term resistance');
    if (indicators.macd.histogram > 0) keyFactors.push('MACD crossover confirms bullish short-term signal');
    else keyFactors.push('MACD bearish crossover — exercise caution');
    if (lastClose > indicators.sma200) keyFactors.push('Price above 200-day MA — long-term uptrend intact');
    else keyFactors.push('Price below 200-day MA — long-term weakness');
    keyFactors.push(`ATR-based daily volatility band: ±${(dailyVolatility * 100).toFixed(1)}%`);

    return { points, oneWeek: at(7), oneMonth: at(30), threeMonths: at(90), trend, trendStrength, modelAccuracy, keyFactors };
  }

  async getStockData(symbol: string): Promise<StockData> {
    return this.generateMockData(symbol);
  }

  async getHistoricalData(symbol: string, range: string = '1Y'): Promise<HistoricalData[]> {
    const daysMap: Record<string, number> = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, '5Y': 1825 };
    return this.generateHistoricalData(symbol, daysMap[range] ?? 365);
  }

  async getFullAnalysis(symbol: string, range: string = '1Y'): Promise<StockAnalysis> {
    const stock = await this.getStockData(symbol);
    const historical = await this.getHistoricalData(symbol, range);
    const indicators = this.calculateTechnicalIndicators(historical);
    const recommendation = this.generateRecommendation(stock, historical, indicators);
    const prediction = this.generatePrediction(historical, indicators, recommendation);
    return { stock, historical, indicators, recommendation, prediction };
  }

  subscribeToUpdates(symbol: string, callback: (data: StockData) => void): () => void {
    if (!this.subscribers.has(symbol)) this.subscribers.set(symbol, new Set());
    this.subscribers.get(symbol)!.add(callback);

    if (!this.intervals.has(symbol)) {
      const interval = setInterval(() => {
        this.subscribers.get(symbol)?.forEach(cb => cb(this.generateMockData(symbol)));
      }, 3000);
      this.intervals.set(symbol, interval);
    }

    this.getStockData(symbol).then(callback);

    return () => {
      const subs = this.subscribers.get(symbol);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          const interval = this.intervals.get(symbol);
          if (interval) { clearInterval(interval); this.intervals.delete(symbol); }
          this.subscribers.delete(symbol);
        }
      }
    };
  }
}

export const stockService = new StockService();

// ─── Stock Lists ───────────────────────────────────────────────────────────────

export const POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'AVGO',
  'JPM', 'V', 'MA', 'BAC', 'GS', 'WFC', 'AXP', 'BLK',
  'JNJ', 'UNH', 'LLY', 'PFE', 'MRK', 'ABBV', 'AMGN', 'TMO',
  'WMT', 'PG', 'KO', 'MCD', 'NKE', 'HD', 'COST', 'DIS',
  'NFLX', 'ADBE', 'CRM', 'ORCL', 'CSCO', 'QCOM', 'INTC', 'AMD',
  'XOM', 'CVX', 'BA', 'CAT', 'RTX', 'LMT', 'GE', 'IBM',
  'PYPL', 'UBER', 'SHOP', 'SNOW', 'CRWD', 'PLTR', 'COIN', 'DDOG',
  'TSM', 'ASML', 'SAP', 'BABA', 'TM', 'SONY', 'INFY', 'HDB',
];

export const INDIA_STOCKS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY 50 - Large Cap Blue Chips
  // ═══════════════════════════════════════════════════════════════════════════
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'BHARTIARTL.NS',
  'SBIN.NS', 'INFOSYS.NS', 'ITC.NS', 'HINDUNILVR.NS', 'LT.NS',
  'BAJFINANCE.NS', 'HCLTECH.NS', 'MARUTI.NS', 'WIPRO.NS', 'ASIANPAINT.NS',
  'AXISBANK.NS', 'KOTAKBANK.NS', 'TITAN.NS', 'SUNPHARMA.NS', 'NESTLEIND.NS',
  'TECHM.NS', 'DRREDDY.NS', 'TATASTEEL.NS', 'ADANIPORTS.NS', 'ADANIENT.NS',
  'ADANIGREEN.NS', 'CIPLA.NS', 'ULTRACEMCO.NS', 'BAJAJFINSV.NS', 'COALINDIA.NS',
  'M&M.NS', 'TATAMOTORS.NS', 'JSWSTEEL.NS', 'POWERGRID.NS', 'NTPC.NS',
  'ONGC.NS', 'GAIL.NS', 'BPCL.NS', 'IOC.NS', 'HINDALCO.NS',
  'GRASIM.NS', 'INDUSINDBK.NS', 'TATACONSUM.NS', 'BRITANNIA.NS', 'EICHERMOT.NS',
  'SHRIRAMFIN.NS', 'BAJAJ-AUTO.NS', 'HEROMOTOCO.NS', 'HDFCLIFE.NS', 'SBILIFE.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY 100 - Additional Large/Mid Caps
  // ═══════════════════════════════════════════════════════════════════════════
  'ADANITOTAL.NS', 'AMBUJACEM.NS', 'AUROPHARMA.NS', 'BANDHANBNK.NS',
  'BERGEPAINT.NS', 'BOSCHLTD.NS', 'CANBK.NS', 'CHOLAFIN.NS',
  'COFORGE.NS', 'DLF.NS', 'DIVISLAB.NS', 'DIXON.NS',
  'GICRE.NS', 'GODREJPROP.NS', 'HAVELLS.NS', 'HINDPETRO.NS',
  'ICICIPRULI.NS', 'IDFCFIRSTB.NS', 'IRFC.NS', 'IRCTC.NS',
  'JINDALSTEL.NS', 'JIOFIN.NS', 'JUBLFOOD.NS', 'LICI.NS',
  'LTIM.NS', 'MANYAVAR.NS', 'MARICO.NS', 'MCDOWELL-N.NS',
  'METROPOLIS.NS', 'MPHASIS.NS', 'MUTHOOTFIN.NS', 'NAUKRI.NS',
  'PAYTM.NS', 'PERSISTENT.NS', 'PETRONET.NS', 'PFC.NS',
  'PIIND.NS', 'PNB.NS', 'POLICYBZR.NS', 'PNC.NS',
  'RAMCOCEM.NS', 'RBLBANK.NS', 'RECLTD.NS', 'REDINGTON.NS',
  'SAIL.NS', 'SRF.NS', 'SYNGENE.NS', 'TATAELXSI.NS',
  'THERMAX.NS', 'TORNTPHARM.NS', 'TRENT.NS', 'TVSMOTOR.NS',
  'UBL.NS', 'UNIONBANK.NS', 'VBL.NS', 'VOLTAS.NS',
  'ZOMATO.NS', 'ZYDUSLIFE.NS', 'APOLLOHOSP.NS', 'DMART.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY IT Index
  // ═══════════════════════════════════════════════════════════════════════════
  'WIPRO.NS', 'INFOSYS.NS', 'TCS.NS', 'HCLTECH.NS',
  'TECHM.NS', 'LTIM.NS', 'PERSISTENT.NS', 'COFORGE.NS',
  'MPHASIS.NS', 'LTI.NS', 'OFSS.NS', 'INDIAMART.NS',
  'KPIT.NS', 'NEWGEN.NS', 'INTELLECT.NS', 'TRITURNT.NS',
  'ASTERDM.NS', 'SONATSOFTW.NS', 'KFINTECH.NS', 'MAZDOCK.NS',
  'TANLA.NS', 'BSOFT.NS', 'DATAPATTNS.NS', 'NAZARA.NS',
  'ECLERX.NS', 'CYIENT.NS', 'MINDTREE.NS', 'ZENSARTECH.NS',
  'ORACLEFIN.NS', 'HAPPSTMNDS.NS', 'RAMCODA.NS', 'IRIS.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Bank Index
  // ═══════════════════════════════════════════════════════════════════════════
  'HDFCBANK.NS', 'ICICIBANK.NS', 'KOTAKBANK.NS', 'AXISBANK.NS',
  'SBIN.NS', 'INDUSINDBK.NS', 'BAJFINANCE.NS', 'AUBANK.NS',
  'FEDERALBNK.NS', 'IDFCFIRSTB.NS', 'BANDHANBNK.NS', 'RBLBANK.NS',
  'PNB.NS', 'BANKBARODA.NS', 'CANBK.NS', 'UNIONBANK.NS',
  'IOB.NS', 'CENTRALBK.NS', 'INDIANB.NS', 'UCOBANK.NS',
  'MAHABANK.NS', 'PSB.NS', 'J&KBANK.NS', 'SOUTHIND.NS',
  'DCBBANK.NS', 'CSBBANK.NS', 'CUB.NS', 'KARURVYSYA.NS',
  'LAKSHVILAS.NS', 'DHANUKA.NS', 'REPCOHOME.NS', 'PNBHOUSING.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Auto Index
  // ═══════════════════════════════════════════════════════════════════════════
  'MARUTI.NS', 'TATAMOTORS.NS', 'M&M.NS', 'BAJAJ-AUTO.NS',
  'HEROMOTOCO.NS', 'EICHERMOT.NS', 'TVSMOTOR.NS', 'BOSCHLTD.NS',
  'MRF.NS', 'APOLLOTYRE.NS', 'CEATLTD.NS', 'JKTYRE.NS',
  'BEL.NS', 'BHARATFORG.NS', 'MOEQUIP.NS', 'SWARAJENG.NS',
  'ESCORTS.NS', 'ATULAUTO.NS', 'BALKRISIND.NS', 'OLECTRA.NS',
  'JBMHAUS.NS', 'LML.NS', 'RAJRATHAN.NS', 'SUPPETRO.NS',
  'TIINDIA.NS', 'TATAMTRDVR.NS', 'SHREECEM.NS', 'EXIDEIND.NS',
  'AMARAJABAT.NS', 'HIGHNESS.NS', 'SATHELIX.NS', 'AUTOLITD.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Pharma Index
  // ═══════════════════════════════════════════════════════════════════════════
  'SUNPHARMA.NS', 'CIPLA.NS', 'DRREDDY.NS', 'DIVISLAB.NS',
  'APOLLOHOSP.NS', 'LUPIN.NS', 'BIOCON.NS', 'CADILAHC.NS',
  'TORNTPHARM.NS', 'AUROPHARMA.NS', 'ZYDUSLIFE.NS', 'JUBLPHARMA.NS',
  'ABBOTINDIA.NS', 'GLENMARK.NS', 'SANOFI.NS', 'PFIZER.NS',
  'NOVARTIND.NS', 'IPCALAB.NS', 'GLAXO.NS', 'ALKEM.NS',
  'LAURUSLABS.NS', 'NEULANDLAB.NS', 'JBCHEMICAL.NS', 'ERIS.NS',
  'CONCOR.NS', 'GRANULES.NS', 'SHILPAMED.NS', 'JENBURPT.NS',
  'MANKIND.NS', 'NATCOPHARM.NS', 'STRIDES.NS', 'MEDPLUS.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY FMCG Index
  // ═══════════════════════════════════════════════════════════════════════════
  'HINDUNILVR.NS', 'ITC.NS', 'NESTLEIND.NS', 'BRITANNIA.NS',
  'DABUR.NS', 'MARICO.NS', 'GODREJCP.NS', 'COLPAL.NS',
  'EMAMILTD.NS', 'TATACONSUM.NS', 'PGHL.NS', 'VBL.NS',
  'RADICO.NS', 'UBL.NS', 'MCDOWELL-N.NS', 'GANESHAPE.NS',
  'HATSUN.NS', 'HERITGFOOD.NS', 'AVANTifeed.NS', 'BRANDON.NS',
  'KRBL.NS', 'LTFOODS.NS', 'CHAMBLFERT.NS', 'DWARIKESH.NS',
  'BAJAJCON.NS', 'RUCHI.SOYA.NS', 'ADANIWILM.NS', 'WILMAR.NS',
  'BAJAJHIND.NS', 'TRIDENT.NS', 'WELSPUNIND.NS', 'AKZOINDIA.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Energy Index
  // ═══════════════════════════════════════════════════════════════════════════
  'RELIANCE.NS', 'ONGC.NS', 'GAIL.NS', 'POWERGRID.NS',
  'NTPC.NS', 'TATAPOWER.NS', 'ADANIPOWER.NS', 'BPCL.NS',
  'IOC.NS', 'HINDPETRO.NS', 'OIL.NS', 'PETRONET.NS',
  'ADANIGREEN.NS', 'JSWENERGY.NS', 'PFC.NS', 'RECLTD.NS',
  'NHPC.NS', 'SJVN.NS', 'NLCINDIA.NS', 'COALINDIA.NS',
  'GMDCLTD.NS', 'APGENCO.NS', 'GSPL.NS', 'IGL.NS',
  'MGL.NS', 'GTL.NS', 'ATGL.NS', 'MGL.NS',
  'GAILNIDHI.NS', 'HINDOILEXP.NS', 'SELANESE.NS', 'JINDRILL.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Metal Index
  // ═══════════════════════════════════════════════════════════════════════════
  'TATASTEEL.NS', 'JSWSTEEL.NS', 'HINDALCO.NS', 'VEDL.NS',
  'JINDALSTEL.NS', 'SELANESE.NS', 'COALINDIA.NS', 'MOIL.NS',
  'SAIL.NS', 'RATHIHS.NS', 'MAHSCOOT.NS', 'ALOKIND.NS',
  'SHYAMCENT.NS', 'NATLSTEEL.NS', 'UTTAMSE.NS', 'KSL.NS',
  'MT Educare.NS', 'MMTC.NS', 'HINDZINC.NS', 'BALAJIAMIN.NS',
  'NACLIND.NS', 'GMDCLTD.NS', 'ORIENTREF.NS', 'HEG.NS',
  'GRAPHITE.NS', 'ELECTCAST.NS', 'IMPAL.NS', 'JSL.NS',
  'SHREECES.NS', 'MIDHANI.NS', 'NMDC.NS', 'KIOCL.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Realty Index
  // ═══════════════════════════════════════════════════════════════════════════
  'DLF.NS', 'GODREJPROP.NS', 'BRIGADE.NS', 'PHOENIXLND.NS',
  'OBEROIRLTY.NS', 'MACBREW.NS', 'PRESTIGE.NS', 'SOBHA.NS',
  'GODREJIND.NS', 'MAHLIFE.NS', 'NIFTYEA.NS', 'INDIABULLS.NS',
  'AMBUJA.NS', 'RAMCO.NS', 'ASHIANA.NS', 'NAVINIT.NS',
  'ANSALAPI.NS', 'OSWALAGRO.NS', 'PATELENG.NS', 'ARVIND.NS',
  'JKPAPER.NS', 'WESTCOST.NS', 'TCIWORLD.NS', 'INDHOTEL.NS',
  'EIHOTEL.NS', 'TAJGVK.NS', 'BHANSALI.NS', 'ROYALORCH.NS',
  'CHENNPETR.NS', 'GOACARBON.NS', 'HOTELLEELA.NS', 'ADVANIHOTR.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Infrastructure
  // ═══════════════════════════════════════════════════════════════════════════
  'LT.NS', 'BHARATI.NS', 'CONCOR.NS', 'IRCON.NS',
  'RITES.NS', 'RAILTEL.NS', 'IRFC.NS', 'CONTAINER.NS',
  'GPTINFRA.NS', 'KNRCON.NS', 'PBAINFRA.NS', 'PATELENG.NS',
  'PRSGRP.NS', 'SIMPLEX.NS', 'HINDCON.NS', 'ASHIANA.NS',
  'BRIGADE.NS', 'DLF.NS', 'GODREJPROP.NS', 'PHOENIXLND.NS',
  'OBEROIRLTY.NS', 'PRESTIGE.NS', 'SOBHA.NS', 'MAHLIFE.NS',
  'JAIBala.NS', 'JKSYNTEX.NS', 'MYSOREBANK.NS', 'UCO.NS',
  'NTPCREG.NS', 'NHICL.NS', 'APTRANSCO.NS', 'POWERINDIA.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY PSU Bank Index
  // ═══════════════════════════════════════════════════════════════════════════
  'SBIN.NS', 'PNB.NS', 'BANKBARODA.NS', 'CANBK.NS',
  'UNIONBANK.NS', 'IOB.NS', 'CENTRALBK.NS', 'INDIANB.NS',
  'UCOBANK.NS', 'MAHABANK.NS', 'PSB.NS', 'J&KBANK.NS',
  'VIJAYABANK.NS', 'DENABANK.NS', 'ORIENTBANK.NS', 'CORPBANK.NS',
  'ANDHRABANK.NS', 'ALLAHABANK.NS', 'SYNDIBANK.NS', 'IDBI.NS',
  'SOUTHBANK.NS', 'FEDBANK.NS', 'SOUTHIND.NS', 'TMB.NS',
  'SVC.NS', 'NKGSB.NS', 'VASCON.NS', 'KARNATAKA.NS',
  'LAKSHMI.NS', 'DENA.NS', 'BOM.NS', 'PB.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Media Index
  // ═══════════════════════════════════════════════════════════════════════════
  'ZEEL.NS', 'PVR.NS', 'SUNTV.NS', 'DBCORP.NS',
  'HINDUSTAN.NS', 'JAGRAN.NS', 'DINSE.NS', 'TV18BRDCST.NS',
  'NETWORK18.NS', 'MIDDAY.NS', 'HTMEDIA.NS', 'NAVRATNA.NS',
  'TVTODAY.NS', 'INXT.NS', 'JISTELECOMM.NS', 'SAREGAMA.NS',
  'TIPSINDLTD.NS', 'MADHU.NS', 'VALUENET.NS', 'NCC.NS',
  'V-MART.NS', 'TATASTLBSL.NS', 'BSL.NS', 'SUZLON.NS',
  'IBVENTURES.NS', 'NXTDIGITA.NS', 'HINDUJA.NS', 'JMC.NS',
  'KSL.NS', 'NAVKAR.NS', 'SHRIRAM.NS', 'WHEELSINDIA.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Consumer Durables
  // ═══════════════════════════════════════════════════════════════════════════
  'TITAN.NS', 'TRENT.NS', 'PAGEIND.NS', 'VIPIND.NS',
  'SAMMAZ.NS', 'TTKPRESTIG.NS', 'HINDUNILVR.NS', 'GODREJCP.NS',
  'COLPAL.NS', 'EMAMILTD.NS', 'BAJAJELEC.NS', 'INFRATEL.NS',
  'HONAUT.NS', 'WHIRLPOOL.NS', 'VOLTAS.NS', 'BLUEBLEN.NS',
  'KERNEX.NS', 'CENTURYPly.NS', 'GREENPLY.NS', 'Kajaria.NS',
  'SOMANYCRA.NS', 'ASIANTILES.NS', 'HIRANANDANI.NS', 'MOTILAL.NS',
  'LUPINTECH.NS', 'SYMPHONY.NS', 'EIH.NS', 'TATAINVEST.NS',
  'AARTIDRUGS.NS', 'LLOYD.NS', 'AMBER.NS', 'ORIENTELEC.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Healthcare Index
  // ═══════════════════════════════════════════════════════════════════════════
  'APOLLOHOSP.NS', 'FORTIS.NS', 'METROHOSP.NS', 'MAX.NS',
  'MEDANTA.NS', 'NH.NS', 'KOCHIREF.NS', 'GLOBALHOSP.NS',
  'DRAGIND.NS', 'ALKEM.NS', 'CIPLA.NS', 'SUNPHARMA.NS',
  'LUPIN.NS', 'DRREDDY.NS', 'BIOCON.NS', 'DIVISLAB.NS',
  'AUROPHARMA.NS', 'TORNTPHARM.NS', 'ZYDUSLIFE.NS', 'LAURUSLABS.NS',
  'IPCALAB.NS', 'JUBLPHARMA.NS', 'MANKIND.NS', 'NATCOPHARM.NS',
  'STRIDES.NS', 'GLENMARK.NS', 'SYNGENE.NS', 'BIOCON.NS',
  'LAURUS.NS', 'GRANULES.NS', 'SHILPA.NS', 'CAPLIN.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Financial Services
  // ═══════════════════════════════════════════════════════════════════════════
  'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'HDFC.NS', 'HDFCLIFE.NS',
  'ICICIGI.NS', 'ICICIPRULI.NS', 'SBILIFE.NS', 'GICRE.NS',
  'MUTHOOTFIN.NS', 'CHOLAFIN.NS', 'SHRIRAMFIN.NS', 'LICI.NS',
  'PFC.NS', 'RECLTD.NS', 'MAHFIN.NS', 'ADANIFIN.NS',
  'JMFINANCIAL.NS', 'RELIANCE.NS', 'TATAINVEST.NS', 'BAJAJHLDNG.NS',
  'BFUTIL.NS', 'MOTILALOS.NS', 'IDFC.NS', 'INFIBEAM.NS',
  '5PAISA.NS', 'ANGELONE.NS', 'IIFL.NS', 'ICICIDIRECT.NS',
  'NJINDIA.NS', 'AXISCONS.NS', 'INVESTSMART.NS', 'SHAREINDIA.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // NIFTY Midcap 100
  // ═══════════════════════════════════════════════════════════════════════════
  'ADANIE.NS', 'AUBANK.NS', 'AARTIIND.NS', 'ABBOTINDIA.NS',
  'ASHOKLEY.NS', 'BAJAJELEC.NS', 'BALKRISIND.NS', 'BEL.NS',
  'BHARATFORG.NS', 'BHEL.NS', 'BSOFT.NS', 'COLPAL.NS',
  'CREDITACC.NS', 'CROMPTON.NS', 'DABUR.NS', 'DEEPAKNTR.NS',
  'ESCORTS.NS', 'EXIDEIND.NS', 'GLENMARK.NS', 'GODREJCP.NS',
  'GPIL.NS', 'HEG.NS', 'HINDAERO.NS', 'INDIAMART.NS',
  'INDIGO.NS', 'INDOCO.NS', 'IPCALAB.NS', 'JCHEMICAL.NS',
  'JKPAPER.NS', 'JUBLFOOD.NS', 'KANSAINER.NS', 'KEI.NS',
  'KPIT.NS', 'LAOPALA.NS', 'LUPIN.NS', 'MAHSCOOT.NS',
  'MAZDOCK.NS', 'MCX.NS', 'METROPOLIS.NS', 'MFSL.NS',
  'NAUKRI.NS', 'NEWGEN.NS', 'OFSS.NS', 'PAGEIND.NS',
  'PFIZER.NS', 'PNBHOUSING.NS', 'POLYCAB.NS', 'PVR.NS',
  'RADICO.NS', 'RATNAMANI.NS', 'SANOFI.NS', 'Solar.NS',
  'SYMPHONY.NS', 'TATAELXSI.NS', 'THERMAX.NS', 'TRIDENT.NS',
  'TTKPRESTIG.NS', 'UBL.NS', 'UNIONBANK.NS', 'VBL.NS',
  'VIPIND.NS', 'VOLTAS.NS', 'WHIRLPOOL.NS', 'ZEELEARN.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // Popular Indian Startups / New Age Tech Stocks
  // ═══════════════════════════════════════════════════════════════════════════
  'ZOMATO.NS', 'NYKAA.NS', 'PAYTM.NS', 'POLICYBZR.NS',
  'IXIGO.NS', 'FRESHWORKS.NS', 'ZENSARTECH.NS', 'LTIMINDTREE.NS',
  'HAPPY.FOR.NS', 'CARS.NS', 'DELHIVERY.NS', 'GOANNUITY.NS',
  'SWIGGY.NS', 'BLUEDART.NS', 'TCIEXP.NS', 'GESHIP.NS',
  'AVASOFT.NS', 'DATAMATICS.NS', 'KFINTECH.NS', 'CAMSYS.NS',
  'EASEMYTRIP.NS', 'YATRA.NS', 'TRAVELOCITY.NS', 'IBRELS.NS',
  'NYKAA.NS', 'FSL.NS', 'HAPPSTMNDS.NS', 'FIVE.NS',
  'NAZARA.NS', 'ZUARI.NS', 'GLOBAL.NS', 'INDIGO.NS',

  // ═══════════════════════════════════════════════════════════════════════════
  // Additional Mid/Small Cap Stocks
  // ═══════════════════════════════════════════════════════════════════════════
  '3MINDIA.NS', 'AARTIDRUGS.NS', 'AARTISURF.NS', 'ABSLAMC.NS',
  'ACC.NS', 'ADANIPOWA.NS', 'ADSL.NS', 'ADVANIHOTR.NS',
  'AKSHARCHEM.NS', 'ALBOND.NS', 'ALKALI.NS', 'ALOKIND.NS',
  'AMARAHA.NS', 'AMBER.NS', 'AMRUTANJAN.NS', 'ANANDRATHI.NS',
  'ANDHRAPAPER.NS', 'ANKITMETAL.NS', 'ANSALAPI.NS', 'ANTGRAPHIC.NS',
  'APCH.NS', 'APIL.NS', 'APLAPOLLO.NS', 'APLLTD.NS',
  'APOLLOTYRE.NS', 'APTECHT.NS', 'ARBL.NS', 'ARCESIUM.NS',
  'ARVIND.NS', 'ARVINDFASN.NS', 'ARYAMAN.NS', 'ASAHIINDIA.NS',
  'ASHIANA.NS', 'ASHOKA.NS', 'ASIANHOSPN.NS', 'ASPINWALL.NS',
  'ASTEC.NS', 'ASTRAL.NS', 'ASTRAMICRO.NS', 'ATUL.NS',
  'ATULAUTO.NS', 'AURIONPRO.NS', 'AUTOAXLES.NS', 'AUTOLITD.NS',
  'AVANCE.NS', 'AVANTIFEED.NS', 'BAGIC.NS', 'BALAMINES.NS',
  'BALAXI.NS', 'BALCORP.NS', 'BALENCD.NS', 'BALMLAWRIE.NS',
  'BALKRISHNA.NS', 'BANARIS.NS', 'BANCOINDIA.NS', 'BANDHANBNK.NS',
  'BANSWRAS.NS', 'BARTRONICS.NS', 'BASMLAT.NS', 'BBTC.NS',
  'BDH.NS', 'BEML.NS', 'BENGALASM.NS', 'BHAGYANGR.NS',
  'BHARATB.NS', 'BHARATRAS.NS', 'BHARATW.NS', 'BHEL.NS',
  'BHOLANATH.NS', 'BHPGROUP.NS', 'BHUMI.NS', 'BIL.NS',
  'BINDALAGG.NS', 'BIOGEN.NS', 'BIRLACORP.NS', 'BIRLAMONEY.NS',
  'BKECOMM.NS', 'BLACKROSE.NS', 'BLBL.NS', 'BLUEDART.NS',
  'BLUESTARCO.NS', 'BLS.NS', 'BNRSEC.NS', 'BODYCARE.NS',
  'BPCL.NS', 'BRANCO.NS', 'BRIGADE.NS', 'BRNL.NS',
  'BSE.NS', 'BSON.NS', 'BUTTERGOLD.NS', 'CALSOFT.NS',
  'CAMBRIDGE.NS', 'CAMS.NS', 'CANBK.NS', 'CANDC.NS',
  'CAPLIPOINT.NS', 'CARBORUNIV.NS', 'CAREERP.NS', 'CARNATION.NS',
  'CASTEXTECH.NS', 'CATALYT.NS', 'Ceat.NS', 'CENTURYPLY.NS',
  'CERA.NS', 'CESC.NS', 'CGCL.NS', 'CHAMBLFERT.NS',
  'CHANDAN.NS', 'CHEMPLAST.NS', 'CHENNPETRO.NS', 'CHOLAFIN.NS',
  'CHOLAHLDNG.NS', 'CHOKANI.NS', 'CIPLA.NS', 'CIMB.NS',
  'CMRSL.NS', 'COALINDIA.NS', 'COCHINSHIP.NS', 'COFORGE.NS',
  'COKELTD.NS', 'COLPAL.NS', 'CONCOR.NS', 'CONTAINER.NS',
  'CORALFINAC.NS', 'CORDSCABLE.NS', 'COUNTRYSID.NS', 'CPSEETF.NS',
  'CREATIVE.NS', 'CREDITACC.NS', 'CRUPAJI.NS', 'CRUSADER.NS',
  'CROMPTON.NS', 'CRSYL.NS', 'CUB.NS', 'CUMMINSIND.NS',
  'CURATAIN.NS', 'DABUR.NS', 'DALMIA.NS', 'DALBHARA.NS',
  'DAMODARIND.NS', 'DATAMATICS.NS', 'DAVANAGERE.NS', 'DBREALTY.NS',
  'DBSTOCKBRO.NS', 'DCAL.NS', 'DCBBANK.NS', 'DCMSRIND.NS',
  'DEEPAKFERT.NS', 'DEEPAKNTR.NS', 'DELHIVERY.NS', 'DENORA.NS',
  'DHANUKA.NS', 'DHARMABEF.NS', 'DHAVANIFIN.NS', 'DIGJAM.NS',
  'DIWL.NS', 'DIXON.NS', 'DLINKIND.NS', 'DLF.NS',
  'DOLAT.NS', 'DOLLAR.NS', 'DOMS.NS', 'DREDGING.NS',
  'DRREDDY.NS', 'EASEMYTRIP.NS', 'ECKART_N.NS', 'EDELWEISS.NS',
  'EICHERMOT.NS', 'EIDPARRY.NS', 'EIHOTEL.NS', 'EIMCOELECON.NS',
  'ELECTCAST.NS', 'ELECON.NS', 'ELECTHERM.NS', 'ELGIEQUIP.NS',
  'ELGIFT.NS', 'ELNET.NS', 'EMAMIPAPER.NS', 'EMAMILTD.NS',
  'EMKAY.NS', 'ENERBUILD.NS', 'ENIL.NS', 'EPLIC.NS',
  'EQI.NS', 'EQUITAS.NS', 'EQUITASBNK.NS', 'ERIS.NS',
  'ESCORTS.NS', 'ESSESEP.NS', 'ESSELPROP.NS', 'ESTER.NS',
  'EUROBOND.NS', 'EUROTEXIND.NS', 'EVEREADY.NS', 'EVERESTIND.NS',
  'EXCELINDUS.NS', 'EXIDEIND.NS', 'FCON.NS', 'FDC.NS',
  'FEDERALBNK.NS', 'FINEORG.NS', 'FINOLAX.NS', 'FINOLEXC.NS',
  'FSL.NS', 'FORTIS.NS', 'FOSECOIND.NS', 'FOURTH.NS',
  'FREAKOUT.NS', 'FRETAIL.NS', 'FROCESS.NS', 'FSL.NS',
  'GABRIEL.NS', 'GALAXYSURF.NS', 'GALLIFORD.NS', 'GAMNINFRA.NS',
  'GANDHI.NS', 'GANGES.NS', 'GARBIEN.NS', 'GARDENREACH.NS',
  'GARI.NS', 'GCPL.NS', 'GDML.NS', 'GEPOWER.NS',
  'GETZPHARMA.NS', 'GEV.NS', 'GICHOTNE.NS', 'GIDLEC.NS',
  'GIPCL.NS', 'GIPL.NS', 'GKWLIMIT.NS', 'Gland.NS',
  'GLAND.NS', 'GLENMARK.NS', 'GLM.NS', 'GLS.NS',
  'GMBH.NS', 'GMMPAULTRD.NS', 'GMRINFRA.NS', 'GNA.NS',
  'GODEX.NS', 'GODREJAGRO.NS', 'GODREJCP.NS', 'GODREJIND.NS',
  'GODREJPROP.NS', 'GOCLCORP.NS', 'GOLDDRAIN.NS', 'GOLDIAM.NS',
  'GOLDSTONE.NS', 'GOODYEAR.NS', 'GPPL.NS', 'GRPLTD.NS',
];

// Sector-wise Indian stock categorization
export const INDIA_STOCK_SECTORS = {
  // Banking & Financial Services
  'Banks': [
    'HDFCBANK.NS', 'ICICIBANK.NS', 'KOTAKBANK.NS', 'AXISBANK.NS',
    'SBIN.NS', 'INDUSINDBK.NS', 'BANDHANBNK.NS', 'RBLBANK.NS',
    'FEDERALBNK.NS', 'IDFCFIRSTB.NS', 'PNB.NS', 'BANKBARODA.NS',
    'CANBK.NS', 'UNIONBANK.NS', 'AUBANK.NS', 'IOB.NS',
    'SOUTHIND.NS', 'DCBBANK.NS', 'CUB.NS', 'KARURVYSYA.NS',
  ],
  'Insurance & NBFC': [
    'HDFCLIFE.NS', 'SBILIFE.NS', 'ICICIPRULI.NS', 'ICICIGI.NS',
    'GICRE.NS', 'LICI.NS', 'BAJAJFINSV.NS', 'SHRIRAMFIN.NS',
    'CHOLAFIN.NS', 'MUTHOOTFIN.NS', 'BAJFINANCE.NS', 'PFC.NS',
    'RECLTD.NS', 'JIOFIN.NS', 'ADANIFIN.NS', 'JMFINANCIAL.NS',
  ],
  'IT Services': [
    'TCS.NS', 'INFOSYS.NS', 'HCLTECH.NS', 'WIPRO.NS',
    'TECHM.NS', 'LTIM.NS', 'PERSISTENT.NS', 'COFORGE.NS',
    'MPHASIS.NS', 'KPIT.NS', 'NEWGEN.NS', 'TRITURNT.NS',
    'OFSS.NS', 'INDIAMART.NS', 'KFINTECH.NS', 'MAZDOCK.NS',
  ],
  'Pharma & Healthcare': [
    'SUNPHARMA.NS', 'CIPLA.NS', 'DRREDDY.NS', 'DIVISLAB.NS',
    'AUROPHARMA.NS', 'LUPIN.NS', 'TORNTPHARM.NS', 'ZYDUSLIFE.NS',
    'BIOCON.NS', 'APOLLOHOSP.NS', 'GLENMARK.NS', 'ALKEM.NS',
    'IPCALAB.NS', 'NATCOPHARM.NS', 'ABBOTINDIA.NS', 'PFIZER.NS',
  ],
  'Automobile & Auto Components': [
    'MARUTI.NS', 'TATAMOTORS.NS', 'M&M.NS', 'BAJAJ-AUTO.NS',
    'HEROMOTOCO.NS', 'EICHERMOT.NS', 'TVSMOTOR.NS', 'BOSCHLTD.NS',
    'APOLLOTYRE.NS', 'MRF.NS', 'CEATLTD.NS', 'ESCORTS.NS',
    'EXIDEIND.NS', 'AMARAJABAT.NS', 'BALKRISIND.NS', 'TIINDIA.NS',
  ],
  'FMCG & Consumer': [
    'HINDUNILVR.NS', 'ITC.NS', 'NESTLEIND.NS', 'BRITANNIA.NS',
    'DABUR.NS', 'MARICO.NS', 'GODREJCP.NS', 'COLPAL.NS',
    'EMAMILTD.NS', 'TATACONSUM.NS', 'PIDILITIND.NS', 'ASIANPAINT.NS',
    'BERGEPAINT.NS', 'HAVELLS.NS', 'VBL.NS', 'UBL.NS',
  ],
  'Energy & Power': [
    'RELIANCE.NS', 'ONGC.NS', 'NTPC.NS', 'POWERGRID.NS',
    'TATAPOWER.NS', 'ADANIGREEN.NS', 'ADANIPOWER.NS', 'JSWENERGY.NS',
    'BPCL.NS', 'IOC.NS', 'HINDPETRO.NS', 'GAIL.NS',
    'PETRONET.NS', 'OIL.NS', 'COALINDIA.NS', 'NHPC.NS',
  ],
  'Metals & Mining': [
    'TATASTEEL.NS', 'JSWSTEEL.NS', 'HINDALCO.NS', 'VEDL.NS',
    'COALINDIA.NS', 'SAIL.NS', 'JINDALSTEL.NS', 'MOIL.NS',
    'NMDC.NS', 'HEG.NS', 'GRAPHITE.NS', 'APLAPOLLO.NS',
  ],
  'Infrastructure & Construction': [
    'LT.NS', 'DLF.NS', 'GODREJPROP.NS', 'ULTRACEMCO.NS',
    'SHREECEM.NS', 'GRASIM.NS', 'AMBUJACEM.NS', 'RAMCOCEM.NS',
    'PRSMNNR.NS', 'BRIGADE.NS', 'SOBHA.NS', 'PHOENIXLND.NS',
  ],
  'Retail & E-Commerce': [
    'DMART.NS', 'TRENT.NS', 'ZOMATO.NS', 'NYKAA.NS',
    'PAYTM.NS', 'POLICYBZR.NS', 'EASEMYTRIP.NS', 'DELHIVERY.NS',
  ],
  'Media & Entertainment': [
    'ZEEL.NS', 'PVR.NS', 'SUNTV.NS', 'TV18BRDCST.NS',
    'NETWORK18.NS', 'HTMEDIA.NS', 'DBCORP.NS', 'INXHINDIA.NS',
  ],
  'Telecom': [
    'BHARTIARTL.NS', 'IDEA.NS', 'INDUSTOWER.NS', 'RCOM.NS',
    'TATACOMM.NS', 'GTPLHATHWAY.NS', 'HATHWAY.NS', 'DEN.NS',
  ],
};

export const GLOBAL_INDICES = [
  '^GSPC', '^DJI', '^IXIC', '^RUT',
  '^FTSE', '^GDAXI', '^FCHI', '^STOXX50E',
  '^N225', '^HSI', '^KS11', '000001.SS',
  '^NSEI', '^BSESN', '^NSEBANK', '^NIFTY_IT',
  '^AXJO', '^GSPTSE', '^BVSP', '^SSMI',
];

export const CRYPTO_SYMBOLS = ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD'];

export const COMMODITY_SYMBOLS = ['GC=F', 'SI=F', 'CL=F', 'BZ=F'];

// NIFTY Sector Indices
export const NIFTY_SECTORS: Record<string, { symbol: string; base: number; name: string }> = {
  'NIFTY IT': { symbol: '^NIFTY_IT', base: 38000, name: 'NIFTY IT' },
  'NIFTY Bank': { symbol: '^NSEBANK', base: 48000, name: 'NIFTY Bank' },
  'NIFTY Auto': { symbol: '^NIFTYAUTO', base: 22000, name: 'NIFTY Auto' },
  'NIFTY FMCG': { symbol: '^NIFTYFMCG', base: 52000, name: 'NIFTY FMCG' },
  'NIFTY Pharma': { symbol: '^NIFTYPHARMA', base: 18500, name: 'NIFTY Pharma' },
  'NIFTY Energy': { symbol: '^NIFTYENERGY', base: 32000, name: 'NIFTY Energy' },
  'NIFTY Infra': { symbol: '^NIFTYINFRA', base: 8500, name: 'NIFTY Infra' },
  'NIFTY Metal': { symbol: '^NIFTYMETAL', base: 8200, name: 'NIFTY Metal' },
  'NIFTY Realty': { symbol: '^NIFTYREALTY', base: 850, name: 'NIFTY Realty' },
  'NIFTY PSU Bank': { symbol: '^NIFTYPSUBANK', base: 6800, name: 'NIFTY PSU Bank' },
  'NIFTY Pvt Bank': { symbol: '^NIFTYPVTBANK', base: 25000, name: 'NIFTY Pvt Bank' },
  'NIFTY Consumer Dur': { symbol: '^NIFTYCONSUMP', base: 42000, name: 'NIFTY Consumer Durables' },
  'NIFTY Media': { symbol: '^NIFTYMEDIA', base: 1800, name: 'NIFTY Media' },
  'NIFTY Healthcare': { symbol: '^NIFTYHEALTH', base: 14000, name: 'NIFTY Healthcare' },
  'NIFTY Fin Service': { symbol: '^NIFTYFIN', base: 24000, name: 'NIFTY Financial Services' },
};

// India Market Sentiments
export const INDIA_MARKET_NEWS = [
  { title: 'RBI maintains repo rate at 6.5%, focuses on inflation control', impact: 'neutral' },
  { title: 'FIIs turn net buyers for third consecutive week', impact: 'bullish' },
  { title: 'IT sector sees strong Q4 earnings, TCS leads gains', impact: 'bullish' },
  { title: 'Auto sales hit record highs in festive season', impact: 'bullish' },
  { title: 'Rupee strengthens against USD, closes at 83.10', impact: 'bullish' },
  { title: 'Banking sector NPA levels at multi-year lows', impact: 'bullish' },
  { title: 'GDP growth forecast revised to 7.2% for FY25', impact: 'bullish' },
  { title: 'Pharma exports surge 15% amid global demand', impact: 'bullish' },
  { title: 'Infrastructure spending doubles YoY', impact: 'bullish' },
  { title: 'FPI outflows worth ₹8,000 cr this week', impact: 'bearish' },
];

export const MARKET_SECTORS = {
  'Technology': ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META', 'INTC', 'AMD', 'AVGO', 'CSCO', 'QCOM', 'ADBE', 'CRM', 'ORCL', 'TSM', 'ASML', 'SAP'],
  'Finance': ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'V', 'MA', 'AXP', 'BLK', 'SCHW', 'PYPL', 'SQ', 'COIN'],
  'Healthcare': ['JNJ', 'UNH', 'LLY', 'PFE', 'MRK', 'ABBV', 'AMGN', 'TMO', 'DHR', 'AZN', 'NVS', 'GSK'],
  'E-Commerce & Retail': ['AMZN', 'WMT', 'BABA', 'JD', 'PDD', 'COST', 'HD', 'SHOP', 'UBER', 'DASH', 'ABNB'],
  'Energy': ['XOM', 'CVX', 'BP', 'SHEL', 'RIO', 'BHP', 'CL=F', 'BZ=F'],
  'Automotive': ['TSLA', 'TM', 'HMC', 'NIO', 'XPEV', 'LI', 'F', 'GM'],
  'Media & Entertainment': ['DIS', 'NFLX', 'SONY', 'SPOT', 'SNAP', 'META'],
  'India - Large Cap': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'BHARTIARTL.NS', 'INFOSYS.NS', 'LT.NS', 'ITC.NS', 'SBIN.NS', 'HINDUNILVR.NS'],
  'India - IT': ['TCS.NS', 'INFOSYS.NS', 'HCLTECH.NS', 'WIPRO.NS', 'TECHM.NS', 'LTIM.NS', 'PERSISTENT.NS', 'MPHASIS.NS', 'COFORGE.NS', 'KPIT.NS'],
  'India - Banks': ['HDFCBANK.NS', 'ICICIBANK.NS', 'AXISBANK.NS', 'KOTAKBANK.NS', 'SBIN.NS', 'INDUSINDBK.NS', 'BANDHANBNK.NS', 'PNB.NS', 'BANKBARODA.NS', 'FEDERALBNK.NS'],
  'India - Consumer': ['HINDUNILVR.NS', 'ITC.NS', 'NESTLEIND.NS', 'BRITANNIA.NS', 'DABUR.NS', 'MARICO.NS', 'EMAMILTD.NS', 'GODREJCP.NS', 'TATACONSUM.NS', 'JUBLFOOD.NS'],
  'India - Auto': ['MARUTI.NS', 'TATAMOTORS.NS', 'M&M.NS', 'BAJAJ-AUTO.NS', 'HEROMOTOCO.NS', 'TVSMOTOR.NS', 'EICHERMOT.NS', 'BOSCHLTD.NS', 'APOLLOTYRE.NS', 'MRF.NS'],
  'India - Pharma': ['SUNPHARMA.NS', 'DRREDDY.NS', 'CIPLA.NS', 'DIVISLAB.NS', 'APOLLOHOSP.NS'],
  'India - New Age': ['ZOMATO.NS', 'NYKAA.NS', 'PAYTM.NS', 'POLICYBZR.NS', 'IRCTC.NS', 'DMART.NS'],
  'Crypto': ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD'],
  'Commodities': ['GC=F', 'SI=F', 'CL=F', 'BZ=F'],
};
