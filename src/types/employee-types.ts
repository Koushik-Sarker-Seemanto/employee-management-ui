export type EmployeeDto = {
  id: string;
  name: string;
  email: string;
  doB: string;
  fullDoB: string;
  department: string;
};

export const departmentsMap: any = {
  '0': 'Tech',
  '1': 'HR',
  '2': 'Admin',
  '3': 'Accounts',
  '4': 'Marketing'
};

export const departmentsReverseMap: any = {
  Tech: 0,
  HR: 1,
  Admin: 2,
  Accounts: 3,
  Marketing: 4
};
