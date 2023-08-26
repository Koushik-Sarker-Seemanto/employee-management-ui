import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography
} from '@mui/material';

type Column = {
  id: string;
  label: string;
  isAction?: boolean;
  action?: (rowData: any) => React.ReactNode;
};

type Props = {
  columns: Column[];
  data: any[];
  count: number;
  fetchData: (orderBy: string | null, order: string | null, page: number, pageSize: number) => void;
};

const BasicTable: React.FC<Props> = ({ columns, data, count, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    console.log(orderBy, order, page, rowsPerPage);
    fetchData(orderBy, order, page, rowsPerPage);
  }, [orderBy, order, page, rowsPerPage]);

  const handleSortRequest = (property: string) => {
    const newOrderBy = property;
    const newOrder: 'asc' | 'desc' = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    setOrderBy(newOrderBy);
    setOrder(newOrder);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.isAction ? (
                    column.action && (
                      <Typography fontWeight={'bold'} variant={'subtitle1'}>
                        {column.label}
                      </Typography>
                    )
                  ) : (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      <Typography fontWeight={'bold'} variant={'subtitle1'}>
                        {column.label}
                      </Typography>
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={column.id}>
                    {column.isAction ? column.action && <div>{column.action(row)}</div> : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BasicTable;
