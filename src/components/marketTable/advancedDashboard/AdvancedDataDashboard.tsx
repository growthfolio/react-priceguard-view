import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  TablePagination,
  Tooltip,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CryptoRow } from '../../../models';
import { mockMarketData } from '../mockData';

interface AdvancedDataDashboardProps {
  useMockData: boolean;
}

const timeframes = ['5m', '15m', '1h', '4h', '1d'];
const metrics = ['rsi', 'tendency', 'pullback', 'superTrend', 'trueRange', 'superBar', 'divergenceVol'] as const;

const AdvancedDataDashboard: React.FC<AdvancedDataDashboardProps> = ({ useMockData }) => {
  const [cryptoData, setCryptoData] = useState<CryptoRow[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {
    if (useMockData) {
      setCryptoData(mockMarketData);
    } else {
      fetch('/api/crypto-data')
        .then((response) => response.json())
        .then((data: CryptoRow[]) => setCryptoData(data))
        .catch((error) => console.error('Erro ao buscar dados reais:', error));
    }
  }, [useMockData]);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = cryptoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="px-1 pb-1 m-1 shadow-sm">
      {/* Gráficos e Carteira */}
      <section className="flex flex-wrap items-start px-4 pb-2 gap-2">
        {/* Carteira */}
        <div className="w-full sm:w-auto flex flex-col items-center">
          <div className="px-1 mb-4">
            <div className="border border-t-0 rounded-lg shadow-sm px-4 py-2">
              <Typography variant="h6" align="center">
                Available Wallet
              </Typography>
              <Typography variant="h4" color="green" sx={{ fontSize: '2rem', textAlign: 'center' }}>
                $ 151,385.99
              </Typography>
              <Typography sx={{ fontSize: '1rem', textAlign: 'center' }}>
                Month: 180% | Week: 35% | Day: 15%
              </Typography>
            </div>
          </div>

          {/* Gráfico de Pizza */}
          <div className="bg-white p-2">
            <PieChart width={260} height={160}>
              <Pie
                data={cryptoData.map((data) => ({
                  name: data.rawSymbol,
                  value: parseFloat(data.trueRange_1h.replace('%', '') || '0'),
                }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {cryptoData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend align="right" layout="vertical" verticalAlign="middle" />
            </PieChart>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="flex">
          <BarChart
            layout="vertical"
            width={800}
            height={240}
            data={cryptoData.slice(0, 4)}
          >
            <XAxis type="number" />
            <YAxis dataKey="rawSymbol" type="category" />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <RechartsTooltip />
            <Bar dataKey="rsi_1d" fill="#82ca9d" barSize={8} />
          </BarChart>
        </div>
      </section>

      {/* Tabela de Indicadores */}
        <section className="p-2 m-2">
          <Box sx={{ marginTop: 2 }}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontSize: '1.2rem' }}>
                Indicators by Timeframe
              </Typography>
              <TableContainer component={Paper} className="overflow-x-auto" sx={{ marginTop: 4 }}>
                <Table>
                  {/* Cabeçalho */}
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" rowSpan={2} sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                        Symbol
                      </TableCell>
                      {metrics.map((metric) => (
                        <TableCell
                          key={metric}
                          align="center"
                          colSpan={timeframes.length}
                          sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}
                        >
                          {metric.toUpperCase()}
                        </TableCell>
                      ))}
                      <TableCell align="center" rowSpan={2} sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                        Market?
                      </TableCell>
                      <TableCell align="center" rowSpan={2} sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>
                        Bot?
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {metrics.flatMap(() =>
                        timeframes.map((interval) => (
                          <TableCell
                            key={interval}
                            align="center"
                            sx={{
                              padding: '4px',
                              fontSize: '0.8rem',
                              border: '1px solid #ddd',
                            }}
                          >
                            {interval}
                          </TableCell>
                        ))
                      )}
                    </TableRow>
                  </TableHead>

                  {/* Corpo da Tabela */}
                  <TableBody>
                    {paginatedData.map((row, index) => (
                      <TableRow
                        key={index}
                        className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                        sx={{ borderBottom: '1px solid #ddd' }}
                      >
                        <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <Avatar 
                              src={row.imgurl || ''} 
                              alt={row.symbol || ''} 
                              sx={{ width: 30, height: 30 }} // Ajuste do tamanho do Avatar
                            />
                            <Typography 
                              sx={{ fontSize: '0.85rem', fontWeight: 'bold' }} // Texto alinhado ao lado do Avatar
                            >
                              {row.symbol}
                            </Typography>
                          </Box>
                        </TableCell>



                        {metrics.flatMap((metric) =>
                          timeframes.map((interval) => {
                            const value = row[`${metric}_${interval}` as keyof CryptoRow];
                            const isNumber = typeof value === 'number';
                            return (
                              <TableCell
                                key={`${metric}_${interval}`}
                                align="center"
                                sx={{
                                  border: '1px solid #ddd',
                                  backgroundColor: isNumber
                                    ? value > 70
                                      ? '#d4edda'
                                      : value < 30
                                      ? '#f8d7da'
                                      : '#fff3cd'
                                    : '#ffffff',
                                }}
                              >
                                <Tooltip title={value !== null && value !== undefined ? `Value: ${value}` : 'No Data'}>
                                  <div style={{ padding: '4px', borderRadius: '4px' }}>
                                    {value !== null && value !== undefined ? value : '-'}
                                  </div>
                                </Tooltip>
                              </TableCell>
                            );
                          })
                        )}
                        <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                          {row.market ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                          {row.bot ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginação */}
              <TablePagination
                component="div"
                count={cryptoData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15]}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                labelRowsPerPage="Rows per page"
              />
            </Paper>
          </Box>
        </section>
    </div>
  );
};

export default AdvancedDataDashboard;
