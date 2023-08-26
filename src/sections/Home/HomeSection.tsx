import React, { useEffect, useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { Backdrop, Button, Grid, IconButton, Modal, TextField } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EmployeeModal from './components/EmployeeModal';
import { departmentsMap, EmployeeDto } from '../../types/employee-types';
import axios from 'axios';
import Loader from '../../components/Loader';
import { useAsyncDebounce } from 'react-table';

const HomeSection = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<null | EmployeeDto>(null);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [dataCount, setDataCount] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyQuery, setSearchKeyQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [localOrderBy, setLocalOrderBy] = useState<null | string>(null);
  const [localOrder, setLocalOrder] = useState<null | string>(null);
  const [localPage, setLocalPage] = useState<null | number>(null);
  const [localPageSize, setLocalPageSize] = useState<null | number>(null);

  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'department', label: 'Department' },
    { id: 'doB', label: 'Date Of Birth' },
    {
      id: 'action',
      label: 'Action',
      isAction: true,
      action: (rowData: any) => (
        <Grid>
          <IconButton sx={{ mr: 2 }} size={'small'} onClick={() => handleEditClick(rowData)}>
            <EditOutlined />
          </IconButton>
          <IconButton color={'error'} size={'small'} onClick={() => handleDeleteClick(rowData)}>
            <DeleteOutlined />
          </IconButton>
        </Grid>
      )
    }
  ];

  const onSearchChange = useAsyncDebounce((value) => {
    setSearchKeyQuery((old) => {
      if (old.length > 0 && value.length <= 0) {
        fetchEmployees('', localOrderBy, localOrder, localPage, localPageSize);
      }
      return value || '';
    });
  }, 300);

  useEffect(() => {
    if (searchKeyQuery) {
      fetchEmployees(searchKeyQuery, localOrderBy, localOrder, localPage, localPageSize);
    }
  }, [searchKeyQuery]);

  const fetchEmployees = (
    searchKey: string,
    orderBy: string | null,
    order: string | null,
    page: number | null,
    pageSize: number | null
  ) => {
    setLoading(true);
    setLocalOrderBy(orderBy);
    setLocalPage(page);
    setLocalPageSize(pageSize);
    setLocalOrder(order);
    const params = new URLSearchParams();
    orderBy && params.append('SortBy', orderBy);
    searchKey && params.append('SearchKey', searchKey);
    order && params.append('SortType', order);
    page && params.append('PageNo', page.toString());
    pageSize && params.append('PageSize', pageSize.toString());
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/employee?${params.toString()}`)
      .then((res) => {
        console.log('RES: ', res);
        setDataCount(res.data.count || 0);
        const tmpEmployees: EmployeeDto[] = res.data.result.map((x: any) => {
          return { ...x, department: departmentsMap[x.department], doB: new Date(x.doB).toDateString(), fullDoB: new Date(x.doB) };
        });
        console.log('employees: ', tmpEmployees);
        setEmployees(tmpEmployees);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        setLoading(false);
      });
  };

  const handleEditClick = (rowData: any) => {
    console.log('Edit button clicked for:', rowData);
    setSelectedEmployee(rowData);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (rowData: any) => {
    console.log('Delete button clicked for:', rowData);
    setLoading(true);
    axios
      .delete(`${process.env.REACT_APP_BASE_API_URL}/api/employee/${rowData.id}`)
      .then((res) => {
        console.log('RES: ', res);
        fetchEmployees(searchKey, localOrderBy, localOrder, localPage, localPageSize);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loader />}
      <Grid item flexDirection={'row'} xs={8}>
        <Grid item xs={12} justifyContent={'space-between'} display={'flex'}>
          <Grid item>
            <TextField
              variant={'outlined'}
              size={'small'}
              label={'Search'}
              InputLabelProps={{ style: { minHeight: '14px', lineHeight: '12px' } }}
              id="search"
              type="text"
              value={searchKey}
              name="search"
              onChange={(e: any) => {
                onSearchChange(e.target.value);
                setSearchKey(e.target.value);
              }}
              placeholder="Search"
              inputProps={{}}
            />
          </Grid>
          <Grid item>
            <Button variant={'contained'} onClick={() => setOpenAddModal(true)}>
              Add Employee
            </Button>
          </Grid>
        </Grid>
        <Grid item sx={{ py: 2 }}>
          <BasicTable
            columns={columns}
            data={employees}
            count={dataCount}
            fetchData={(orderBy, order, page, pageSize) => fetchEmployees(searchKey, orderBy, order, page, pageSize)}
          />
        </Grid>
      </Grid>

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <EmployeeModal
          isUpdate={true}
          selectedEmployee={selectedEmployee}
          handleClose={() => setOpenEditModal(false)}
          handleSuccess={() => {
            setOpenEditModal(false);
            fetchEmployees(searchKey, localOrderBy, localOrder, localPage, localPageSize);
          }}
        />
      </Modal>

      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <EmployeeModal
          isUpdate={false}
          handleClose={() => setOpenAddModal(false)}
          handleSuccess={() => {
            setOpenAddModal(false);
            fetchEmployees(searchKey, localOrderBy, localOrder, localPage, localPageSize);
          }}
        />
      </Modal>
    </>
  );
};

export default HomeSection;
