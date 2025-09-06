import yahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing stock symbol" });
  }

  try {
    // Fetch price + ETF financial data
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: [
        "price",
        "summaryDetail",
        "defaultKeyStatistics",
        "financialData",
        "fundProfile",
        "earnings",
      ],
    });

    const result = {
      symbol,

      // Price data
      currentPrice: quote.price?.regularMarketPrice || null,
      previousClose: quote.price?.regularMarketPreviousClose || null,
      marketCap: quote.price?.marketCap || null,
      volume: quote.price?.regularMarketVolume || null,

      // ETF fundamentals
      navPrice: quote.summaryDetail?.navPrice || null,
      expenseRatio: quote.fundProfile?.netExpRatio || null,
      totalAssets: quote.summaryDetail?.totalAssets || null,
      bidPrice: quote.summaryDetail?.bid|| null,
      askPrice: quote.summaryDetail?.ask|| null,
      trackingError: quote.fundProfile?.trackingError || null,

      // Classic stock fundamentals (for completeness)
      sharesOutstanding: quote.defaultKeyStatistics?.sharesOutstanding || null,
      freeCashflow: quote.financialData?.freeCashflow || null,
      eps: quote.defaultKeyStatistics?.trailingEps || null,
      epsgrowth: quote.defaultKeyStatistics?.earningsQuarterlyGrowth || null,
      peRatio: quote.summaryDetail?.trailingPE || null,
      roe: quote.financialData?.returnOnEquity || null,
      forwardPE: quote.summaryDetail?.forwardPE || null,
      netdebt: quote.financialData?.totalDebt || null,
      trailingPegRatio: quote.defaultKeyStatistics?.trailingPegRatio || null,
      bookValue: quote.defaultKeyStatistics?.bookValue || null,
      totalRevenue: quote.financialData?.totalRevenue || null,
      profitMargins: quote.financialData?.profitMargins || null,
      dividendRate: quote.summaryDetail?.dividendRate || null,
      dividendYield: quote.summaryDetail?.dividendYield || null,
      beta: quote.summaryDetail?.beta || null,

      timestamp: new Date().toISOString(),
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
