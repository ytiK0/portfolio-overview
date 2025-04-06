import styles from "./portfolioTable.module.scss";
import classnames from "classnames"
import {CSSProperties} from "react";

interface TableRowProps {
  className?: string
  cells: (string | React.ReactNode)[]
  style?: CSSProperties
  onClick?: () => void
}

export default function TableRow({cells, className, style, onClick}: TableRowProps) {
  return (
    <div className={classnames(styles.tableRow, className)} style={style} onClick={onClick}>
      {
        cells.map((cell, i) => (
          <div key={i} className={styles.cell}>{cell}</div>
        ))
      }
    </div>
  );
}
