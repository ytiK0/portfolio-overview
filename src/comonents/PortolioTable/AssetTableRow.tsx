import TableRow from "@/comonents/PortolioTable/TableRow";
import styles from "./portfolioTable.module.scss"
import {CSSProperties, useCallback, useContext} from "react";
import {PortfolioTableContext} from "@/context/portfolio";

interface AssetTableRowProps {
  asset: Asset,
  style?: CSSProperties
}

const order: Array<keyof Asset>= ["ticker", "amount", "price", "totalPrice", "change", "partInPortfolio"];

export default function AssetTableRow({asset, style}: AssetTableRowProps) {
  const currencyFormatter = new Intl.NumberFormat("ru-RU", {style: "currency", currency:"USD"});
  const percentFormatter = new Intl.NumberFormat("ru-RU", {style: "decimal"});

  const {removeAsset} = useContext(PortfolioTableContext)

  const cells = order.map((key) => {
    if (key === "price" || key === "totalPrice") {
      return currencyFormatter.format(asset[key]);
    }
    else if (key === "change") {
      const percent = asset[key];
      const isPositive = percent >= 0;
      const color = isPositive ? "green" : "red";
      return (<span key={asset.ticker} style={{color}}>{ isPositive ? "+" : ""}{percentFormatter.format(percent)}%</span>)
    }
    else if (key === "partInPortfolio") {
      return percentFormatter.format(asset[key]) + "%"
    }
    return asset[key];
  })

  const handleRowClick =useCallback(() => {
    removeAsset(asset.ticker);
  }, [asset.ticker, removeAsset]);

  return (
    <TableRow className={styles.assetTableRow} cells={cells} style={style} onClick={handleRowClick} />
  );
}
