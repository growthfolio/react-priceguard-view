import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableContainer, 
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ViewColumn } from '@mui/icons-material';
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import TableHeader from './TableHeader';
import TableRowData from './TableRowData';
import { CryptoRow } from '../../../models';
import { Column } from '../../../models/dashboards/Column';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';

interface ResizableSortableTableProps {
  data: CryptoRow[];
  columns: Column<CryptoRow>[];
}

const ResizableSortableTable: React.FC<ResizableSortableTableProps> = ({ data, columns }) => {
  const [orderBy, setOrderBy] = useState<keyof CryptoRow>('id');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key as string)
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    columns.reduce((acc, col) => ({ ...acc, [col.key as string]: 150 }), {})
  );

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valueA = a[orderBy]?.toString() || '';
      const valueB = b[orderBy]?.toString() || '';
      const numericA = parseFloat(valueA.replace(/[^0-9.-]/g, '')) || 0;
      const numericB = parseFloat(valueB.replace(/[^0-9.-]/g, '')) || 0;

      return orderDirection === 'asc' ? numericA - numericB : numericB - numericA;
    });
  }, [data, orderBy, orderDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const visibleColumnsData = columns.filter(col => 
    visibleColumns.includes(col.key as string)
  );

  const handleSort = (column: keyof CryptoRow) => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColumnResize = (columnKey: keyof CryptoRow, newWidth: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey as string]: newWidth
    }));
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const getMarketTrendIcon = () => {
    const positiveChanges = data.filter(item => 
      parseFloat(item.priceChange_1m?.toString() || '0') > 0
    ).length;
    const totalItems = data.length;
    const positivePercentage = (positiveChanges / totalItems) * 100;

    return positivePercentage > 50 ? (
      <TrendUp size={24} className="text-green-500" />
    ) : (
      <TrendDown size={24} className="text-red-500" />
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden my-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {getMarketTrendIcon()}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
              <p className="text-sm text-gray-600">
                Mostrando {paginatedData.length} de {sortedData.length} criptomoedas
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Chip 
              label={`${visibleColumns.length} colunas`}
              size="small"
              variant="outlined"
              className="text-gray-600"
            />
            
            <Tooltip title="Configurar colunas">
              <IconButton
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                size="small"
                className={`${showColumnToggle ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
              >
                <ViewColumn />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        
        {/* Column Toggle */}
        {showColumnToggle && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 animate-slide-down">
            <ColumnVisibilityToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumnVisibility}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <TableContainer 
        component={Paper} 
        className="scrollbar overflow-auto"
        style={{ maxHeight: '600px' }}
        elevation={0}
      >
        <Table stickyHeader>
          <TableHeader
            columns={visibleColumnsData}
            orderBy={orderBy}
            orderDirection={orderDirection}
            onSort={handleSort}
            onResize={handleColumnResize}
          />
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRowData
                key={row.id || index}
                row={row}
                columns={visibleColumnsData}
              />
            ))}
            
            {/* Empty state */}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={visibleColumnsData.length} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <TrendUp size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Nenhum dado encontrado</h3>
                      <p className="text-gray-500">Não há dados de mercado disponíveis no momento.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="border-t border-gray-200 bg-gray-50">
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
          className="text-gray-600"
        />
      </div>
    </div>
  );
};

export default ResizableSortableTable;
