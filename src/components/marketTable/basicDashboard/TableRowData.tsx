import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { Column, CryptoRow } from "../../../models";

interface TableRowDataProps {
  row: CryptoRow;
  columns: Column<CryptoRow>[];
}

const TableRowData: React.FC<TableRowDataProps> = ({ row, columns }) => {
  const renderTableCellContent = (column: Column<CryptoRow>) => {
    const { customRender } = column;

    if (customRender) {
      return customRender(row);
    }

    return row[column.key] !== undefined && row[column.key] !== null
      ? row[column.key]?.toString()
      : "N/A";
  };

  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          style={{
            padding: "8px 16px",
            textAlign: column.key === "chart" ? "center" : "left",
            verticalAlign: "middle",
          }}
        >
          {renderTableCellContent(column)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowData;
