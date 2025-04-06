interface Asset {
  ticker: string,
  amount: number,
  price: number,
  totalPrice: number,
  change: number,
  partInPortfolio: number
}

interface AssetProto {
  ticker: Ticker,
  amount: number
}