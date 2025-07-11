import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { Column } from '../../../models/dashboards/Column';
import { CryptoRow } from '../../../models';

interface TableHeaderProps {
  columns: Column<CryptoRow>[]; // Atualizado para usar a interface Column
  orderBy: keyof CryptoRow;
  orderDirection: 'asc' | 'desc';
  onSort: (column: keyof CryptoRow) => void;
  onResize: (columnKey: keyof CryptoRow, newWidth: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  orderBy,
  orderDirection,
  onSort,
  onResize,
}) => {
  const handleResize = (
    e: React.MouseEvent<HTMLDivElement>,
    columnKey: keyof CryptoRow
  ) => {
    e.preventDefault(); // Evitar comportamentos padrão indesejados
    const startX = e.clientX; // Captura a posição inicial do mouse
    const columnElement = document.getElementById(`column-${columnKey}`);

    if (!columnElement) return;

    const initialWidth = columnElement.offsetWidth; // Largura inicial da coluna

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(initialWidth + delta, 50); // Define a largura mínima em 50px
      columnElement.style.width = `${newWidth}px`; // Atualiza o estilo diretamente
      onResize(columnKey, newWidth); // Atualiza o estado no componente pai
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(({ key, label }) => (
          <TableCell
            id={`column-${key}`} // Identificador único para cada célula
            key={key}
            style={{
              position: 'relative',
              backgroundColor: orderBy === key ? '#f5f5f5' : 'inherit',
              fontWeight: orderBy === key ? 'bold' : 'normal',
              cursor: 'pointer',
              padding: '8px 12px',
              width: 'auto', // Inicialmente responsivo
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onClick={() => onSort(key)}
              role="button"
              tabIndex={0}
              aria-label={`Sort by ${label}`}
            >
              <span>{label}</span>
              {orderBy === key && (
                <span>
                  {orderDirection === 'asc' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </span>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '6px',
                height: '100%',
                cursor: 'col-resize',
                backgroundColor: '#d3d3d3',
              }}
              onMouseDown={(e) => handleResize(e, key)}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
