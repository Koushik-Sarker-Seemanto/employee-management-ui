import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import axios from 'axios';
import { departmentsReverseMap, EmployeeDto } from '../../../types/employee-types';
import { useState } from 'react';
import Loader from '../../../components/Loader';

dayjs.extend(utc);

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 480,
  maxWidth: 640,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
};

type Props = {
  handleClose: () => void;
  handleSuccess: () => void;
  isUpdate?: boolean;
  selectedEmployee?: EmployeeDto | null;
};

const EmployeeModal = ({ handleClose, handleSuccess, selectedEmployee = null, isUpdate = false }: Props) => {
  const [loading, setLoading] = useState(false);
  const addEmployee = (values: any) => {
    setLoading(true);
    const payload = {
      name: values.name,
      email: values.email,
      doB: toUTCDate(values.dob),
      department: departmentsReverseMap[values.department]
    };
    console.log('Payload: ', payload);
    axios
      .post(process.env.REACT_APP_BASE_API_URL + '/api/employee', payload, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        handleSuccess();
        setLoading(false);
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        setLoading(false);
      });
  };

  const updateEmployee = (values: any) => {
    setLoading(true);
    console.log('updateEmployee: ', values);
    const payload = {
      id: selectedEmployee?.id,
      name: values.name,
      email: values.email,
      doB: toUTCDate(values.dob),
      department: departmentsReverseMap[values.department]
    };
    console.log('Payload: ', payload);
    axios
      .put(process.env.REACT_APP_BASE_API_URL + '/api/employee', payload, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        setLoading(false);
        handleSuccess();
      })
      .catch((err) => {
        setLoading(false);
        console.error('ERROR: ', err);
      });
  };

  const toUTCDate = (date: string) => {
    const localDate = new Date(date);
    return localDate.toISOString();
  };

  return (
    <Box sx={{ ...style, p: 0 }}>
      {loading && <Loader />}
      <Card>
        <CardHeader
          action={
            <IconButton size={'small'} aria-label="Close" onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          }
          title={<Typography variant={'subtitle1'}>{isUpdate ? 'Update Employee' : 'Add Employee'}</Typography>}
        ></CardHeader>
        <Divider />
        <CardContent>
          <Grid item xs={12} sx={{ mt: 2, px: 1 }}>
            <Formik
              initialValues={{
                name: selectedEmployee ? selectedEmployee.name : '',
                email: selectedEmployee ? selectedEmployee.email : '',
                department: selectedEmployee ? selectedEmployee.department : '',
                dob: selectedEmployee ? selectedEmployee.fullDoB : null,
                submit: null
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
                email: Yup.string().max(255).required('Email is required'),
                department: Yup.string().max(255).required('Department is required'),
                dob: Yup.string().max(255).required('Date of birth is required')
              })}
              onSubmit={(values) => {
                if (isUpdate) {
                  updateEmployee(values);
                } else {
                  addEmployee(values);
                }
              }}
            >
              {({ errors, handleBlur, handleChange, setFieldValue, setFieldTouched, handleSubmit, touched, values }) => (
                <form noValidate>
                  <Grid item xs={12}>
                    <Grid item sx={{ mt: 3 }} xs={12}>
                      <Stack spacing={1}>
                        <TextField
                          fullWidth
                          variant={'outlined'}
                          size={'small'}
                          error={Boolean(touched.name && errors.name)}
                          label={'Name *'}
                          InputLabelProps={{ style: { minHeight: '14px', lineHeight: '12px' } }}
                          id="name"
                          type="name"
                          value={values.name}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Name *"
                          inputProps={{}}
                        />
                        {touched.name && errors.name && (
                          <FormHelperText error id="helper-text-name">
                            {errors.name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item sx={{ mt: 3 }} xs={12}>
                      <Stack spacing={1}>
                        <TextField
                          fullWidth
                          variant={'outlined'}
                          size={'small'}
                          error={Boolean(touched.email && errors.email)}
                          label={'Email *'}
                          InputLabelProps={{ style: { minHeight: '14px', lineHeight: '12px' } }}
                          id="email"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Email *"
                          inputProps={{}}
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="helper-text-email">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item sx={{ mt: 3 }} xs={12} display={'flex'}>
                      <Grid item sx={{ mr: 1 }} xs={6}>
                        <Stack spacing={1}>
                          <FormControl fullWidth>
                            <InputLabel
                              style={{ minHeight: '14px', lineHeight: '12px' }}
                              error={Boolean(touched.department && errors.department)}
                              id="department-select-label"
                            >
                              Department *
                            </InputLabel>
                            <Select
                              variant={'outlined'}
                              size={'small'}
                              labelId="department-select-label"
                              id="department"
                              name="department"
                              placeholder="Department *"
                              value={values.department}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              error={Boolean(touched.department && errors.department)}
                            >
                              <MenuItem key={'Tech'} value={'Tech'}>
                                Tech
                              </MenuItem>
                              <MenuItem key={'HR'} value={'HR'}>
                                HR
                              </MenuItem>
                              <MenuItem key={'Admin'} value={'Admin'}>
                                Admin
                              </MenuItem>
                              <MenuItem key={'Accounts'} value={'Accounts'}>
                                Accounts
                              </MenuItem>
                              <MenuItem key={'Marketing'} value={'Marketing'}>
                                Marketing
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {touched.department && errors.department && (
                            <FormHelperText error id="helper-text-department">
                              {errors.department}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item sx={{ ml: 1 }} xs={6}>
                        <Stack spacing={1}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              timezone={'UTC'}
                              sx={{ input: { height: '7px' } }}
                              onChange={(value) => {
                                const selectedDate = dayjs.utc(value).toDate();
                                console.log('DATE: ', selectedDate);
                                setFieldValue('dob', selectedDate);
                              }}
                              value={dayjs(values.dob) || null}
                            />
                          </LocalizationProvider>
                          {touched.dob && errors.dob && (
                            <FormHelperText error id="helper-text-department">
                              {errors.dob}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 4 }} display={'flex'} justifyContent={'end'}>
                    <Button sx={{ mr: 2 }} onClick={() => handleClose()} variant={'outlined'}>
                      Cancel
                    </Button>
                    <Button
                      variant={'contained'}
                      onClick={(e) => {
                        e.preventDefault();
                        Object.keys(values).forEach((field) => {
                          setFieldTouched(field, true);
                        });
                        handleSubmit();
                      }}
                    >
                      Confirm
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeModal;
