"use client";

import styles from "./portfolioTable.module.scss"
import TableRow from "@/comonents/PortolioTable/TableRow";
import {useLocalStorage} from "@/hooks/useLocalStorage";
import {FixedSizeList as List} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {CSSProperties} from "react";
import AssetTableRow from "@/comonents/PortolioTable/AssetTableRow";

const tableHeadRow = ["Актив", "Количество", "Цена", "Общая стоимость", "Изм. зв 24 ч.", "% портфеля"];

export default function PortfolioTable() {
  const [assets] = useLocalStorage("assets", [] as Asset[]);

  const Row = ({index, style}: {index: number, style: CSSProperties}) => {
    return <AssetTableRow asset={assets[index]} style={style}  />
  }

  return (
    <div className={styles.table}>
      <TableRow cells={tableHeadRow} />
      <div className={styles.tableBody}>
        <AutoSizer>
          {
            ({width, height}) => (
              <List height={height} width={width} itemCount={assets.length} itemSize={40}>
                {Row}
              </List>
            )
          }
        </AutoSizer>
      </div>
    </div>
  );
}
