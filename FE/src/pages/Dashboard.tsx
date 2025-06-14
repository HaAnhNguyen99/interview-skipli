import { Separator } from "../components/commons/ui/separator";
import { getAllEmployees } from "@/services/employeeApi";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/commons/ui/table";
import { useUser } from "@/context/UserContext";
import AddEmployee from "../components/admin/AddEmployee";
import EditEmployee from "../components/admin/EditEmployee";
import type { EmployeeResponse } from "@/types/employee";
import { Badge } from "../components/commons/ui/badge";
import DeleteEmployee from "../components/admin/DeleteEmployee";

const Dashboard = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

  const { token } = useUser();

  const fetchEmployees = useCallback(async () => {
    const response = await getAllEmployees(token);
    setEmployees(response.data.employees);
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="px-10">
      <h1 className="text-3xl font-bold tracking-wider">Manage Employee</h1>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">{employees.length} Employee</h2>
        <div className="flex gap-2">
          <AddEmployee onAdd={() => fetchEmployees()} />
        </div>
      </div>

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="flex items-center gap-2">
                    <img
                      src={employee?.avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    {employee.name}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell className="capitalize">{employee.role}</TableCell>
                  <TableCell className="capitalize">
                    {employee.status === "active" ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 text-white">
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-500 text-white">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <EditEmployee
                      employee={employee}
                      onUpdated={() => fetchEmployees()}
                    />
                    <DeleteEmployee
                      onDelete={() => fetchEmployees()}
                      employeeId={employee.id}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
