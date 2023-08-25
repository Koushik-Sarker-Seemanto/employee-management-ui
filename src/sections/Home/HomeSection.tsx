import React, { useState } from 'react';
import BasicTable from '../../components/BasicTable';
import { Backdrop, Button, Grid, IconButton, Modal } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EmployeeModal from './components/EmployeeModal';
import { EmployeeDto } from '../../types/employee-types';

const HomeSection = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<null | EmployeeDto>(null);
  const [employees, setEmployees] = useState<EmployeeDto[]>([
    { id: '1', name: 'koushik', email: 'koushik@email.com', department: 'Tech', dob: new Date().toDateString() },
    { id: '2', name: 'seemanto', email: 'semanto@email.com', department: 'HR', dob: new Date().toDateString() }
  ]);

  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'department', label: 'Department' },
    { id: 'dob', label: 'Date Of Birth' },
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

  const fetchEmployees = async (orderBy: string | null, order: string | null, page: number, pageSize: number) => {
    // Fetch data logic
  };

  const handleEditClick = (rowData: any) => {
    console.log('Edit button clicked for:', rowData);
    setSelectedEmployee(rowData);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (rowData: any) => {
    console.log('Delete button clicked for:', rowData);
  };

  return (
    <>
      <Grid item flexDirection={'row'} xs={8}>
        <Grid item xs={12} justifyContent={'space-between'} display={'flex'}>
          <Grid item>Filters</Grid>
          <Grid item>
            <Button variant={'contained'} onClick={() => setOpenAddModal(true)}>
              Add Employee
            </Button>
          </Grid>
        </Grid>
        <Grid item sx={{ py: 2 }}>
          <BasicTable columns={columns} data={employees} fetchData={fetchEmployees} onRowButtonClick={handleEditClick} />
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
        <EmployeeModal isUpdate={true} handleClose={() => setOpenEditModal(false)} handleSuccess={() => setOpenEditModal(false)} />
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
        <EmployeeModal isUpdate={false} handleClose={() => setOpenAddModal(false)} handleSuccess={() => setOpenAddModal(false)} />
      </Modal>
    </>
  );
};

export default HomeSection;
