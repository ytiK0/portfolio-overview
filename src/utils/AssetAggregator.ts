export class AssetAggregator {
  constructor(initialAssets?: Asset[]) {
    if (initialAssets) {
      this.assets = initialAssets.reduce<Record<string, Asset>>((acc, ticker) => {
        acc[ticker.ticker] = ticker;
        this.totalPrice += ticker.totalPrice;
        return acc;
      }, {});
      this.recalculateAssets();
    }
  }
  private readonly assets:Record<string, Asset> = {};
  private totalPrice = 0;

  private calculatePart = (price: number) => {
    const part = (price / this.totalPrice) * 100;
    return parseFloat(part.toFixed(2));
  }

  private recalculateAssets = () => {
    for (const ticker in this.assets) {
      this.assets[ticker].totalPrice = this.assets[ticker].amount * this.assets[ticker].price;
      this.assets[ticker].partInPortfolio = this.calculatePart(this.assets[ticker].totalPrice);
    }
  }

  push = (proto: AssetProto) => {
    const { ticker, price, changePercent } = proto.ticker;
    this.totalPrice += price * proto.amount;
    if (!(ticker in this.assets)) {
      this.assets[ticker] = {
        ticker,
        amount: proto.amount,
        price: price,
        totalPrice: price * proto.amount,
        change: changePercent,
        partInPortfolio: this.calculatePart(price * proto.amount),
      }
    }
    else {
      const asset = this.assets[ticker];
      asset.amount += proto.amount;
      asset.totalPrice = asset.amount * asset.price;
    }

    this.recalculateAssets();
  }

  updateAsset = (ticker: string, updData: Pick<Asset, "price" | "change">) => {
    ticker = ticker.toUpperCase();
    if (!(ticker in this.assets)) {
      return;
    }

    const asset = this.assets[ticker];

    asset.change = updData.change;
    asset.change = updData.price;

    this.recalculateAssets();
  }

  removeAsset = (ticker: string) => {
    if (!(ticker in this.assets)) {
      return;
    }

    this.totalPrice -= this.assets[ticker].totalPrice;

    delete this.assets[ticker];

    this.recalculateAssets();
  }

  getAssetsList = () => {
    return Object.values(this.assets);
  }

  getTickers = () => {
    return Object.keys(this.assets);
  }

  getTotalPrice = () => this.totalPrice;

  getTotalAmount = () => Object.values(this.assets).reduce((acc, {amount}) => acc + amount, 0);
}