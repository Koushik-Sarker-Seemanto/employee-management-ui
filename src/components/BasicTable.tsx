import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel, Paper } from '@mui/material';

type Column = {
  id: string;
  label: string;
  isAction?: boolean;
  action?: (rowData: any) => React.ReactNode;
};

type Props = {
  columns: Column[];
  data: any[];
  fetchData: (orderBy: string | null, order: string | null, page: number, pageSize: number) => void;
  onRowButtonClick: (rowData: any) => void;
};

const BasicTable: React.FC<Props> = ({ columns, data, fetchData, onRowButtonClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchData(orderBy, order, page, rowsPerPage);
  }, [orderBy, order, page, rowsPerPage, fetchData]);

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
                      <TableSortLabel direction={orderBy === column.id ? order : 'asc'} onClick={() => handleSortRequest(column.id)}>
                        {column.label}
                      </TableSortLabel>
                    )
                  ) : (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {column.label}
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
        count={100} // Replace with the total count of your data from the API
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BasicTable;
