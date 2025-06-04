export interface EmployeeBase {
  name: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
}

export type EmployeeRole = "sales" | "marketing" | "hr" | "it" | "finance";
export type EmployeeStatus = "active" | "inactive";

export interface Employee extends EmployeeBase {
  id: string;
}

export interface EmployeeResponse extends EmployeeBase {
  id: string;
  createdAt: string;
  status: EmployeeStatus;
}
