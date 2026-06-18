#!/bin/bash
echo "Testing APIs..."

echo "1. FRED API"
curl -s "https://api.stlouisfed.org/fred/series?series_id=GNPCA&api_key=ce0c2bfd28589aa1e1044909bb42de11&file_type=json" | grep -o 'realtime_start\|error'

echo "2. CoinGecko API"
curl -s -H "x-cg-demo-api-key: CG-EvAx6WeGK8cadBQmPXbStKVS" "https://api.coingecko.com/api/v3/ping" | grep -o 'gecko_says\|error'

echo "3. FMP API"
curl -s "https://financialmodelingprep.com/api/v3/quote-short/AAPL?apikey=rk0f7T1p28KMw3oVSk1R4mVCNC0dqDPv" | grep -o 'symbol\|Error Message'

echo "4. Finnhub API"
curl -s "https://finnhub.io/api/v1/quote?symbol=AAPL&token=d8eiojhr01qth3chhtt0d8eiojhr01qth3chhttg" | grep -o 'error\|"c":'

echo "5. Polygon API"
curl -s "https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=_5Fbsk3viKKHT1zNO5l3YS6VQ4IEycR1" | grep -o 'status\|error'

echo "6. Alpha Vantage API"
curl -s "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=BX74RPV36SL22TNE" | grep -o 'Meta Data\|Error Message\|Information'

echo "7. NewsAPI"
curl -s "https://newsapi.org/v2/top-headlines?country=us&apiKey=7b3ddf0a0ccc44929903a729e8dfeac1" | grep -o 'status\|error'

echo "8. NewsData"
curl -s "https://newsdata.io/api/1/news?apikey=pub_c3c7204194ba4ecfac552bb72117c892&q=pizza" | grep -o 'status\|error'

echo "9. NewsAPI.AI"
curl -s "http://eventregistry.org/api/v1/article/getArticles?apiKey=b76fea00-f4af-4c88-bbee-bea4169cbb88" | grep -o 'articles\|error'

