export type EmployeeDto = {
  id: string;
  name: string;
  email: string;
  dob: string;
  department: string;
};

export const departmentsMap: any = {
  '0': 'Tech',
  '1': 'HR',
  '2': 'Admin',
  '3': 'Accounts',
  '4': 'Marketing'
};
