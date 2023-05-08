import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../../components/Layout/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import AddEmpForm from '../../components/Employees/add-emp-form';

const Employees = ({ user }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [employees, setEmployees] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});

  useEffect(() => {
    const getSignedInUser = async () => {
      const res = await axios.get(
        `/api/users/get-user-info?email=${user.email}`
      );
      setSignedInUser(res.data);
    };

    const getDepartmentsAndEmps = async () => {
      const res = await axios.get('/api/departments/list-department');
      setDepartments(res.data);
    };

    getSignedInUser();
    getDepartmentsAndEmps();
  }, [user.email]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);

    const d = departments.find(
      (department) => department._id === e.target.value
    );

    if (!d) setEmployees([]);
    else {
      setSelectedDepartment(d);
      setEmployees(d.employees);
    }
  };

  return (
    <Layout user={user}>
      <h1 className="mb-10 text-2xl font-bold">Nhân sự</h1>

      <section>
        <label
          htmlFor="departments"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Phòng ban
        </label>

        <select
          name="departments"
          id="departments"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleDepartmentChange}
        >
          <option value="">Chọn phòng ban</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
      </section>

      {/* Show all employees of the selected department */}
      <section className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Danh sách nhân viên</h2>

          {/* add employees btn */}
          {Boolean(signedInUser.user_metadata?.role) && (
            <AddEmpForm departments={departments} />
          )}
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Họ tên
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Số điện thoại
                </th>
                <th scope="col" className="px-6 py-3">
                  Địa chỉ
                </th>
                <th scope="col" className="px-6 py-3">
                  Chức vụ
                </th>
                <th scope="col" className="px-6 py-3">
                  CCCD
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày sinh
                </th>
                <th scope="col" className="px-6 py-3">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Show all employees of the selected department */}
              {employees.length > 0 ? (
                employees.map((employee, i) => (
                  <tr
                    key={employee._id}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {i + 1}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {employee.name}
                    </td>
                    <td className="px-6 py-4">{employee.email}</td>
                    <td className="px-6 py-4">
                      {employee.user_metadata.phone_number || 'Chưa cập nhật'}
                    </td>
                    <td className="px-6 py-4">
                      {employee.user_metadata.address || 'Chưa cập nhật'}
                    </td>
                    <td className="px-6 py-4">
                      {employee.user_metadata.title}
                    </td>
                    <td className="px-6 py-4">{employee.user_metadata.cccd}</td>
                    <td className="px-6 py-4">
                      {employee.user_metadata.birthday
                        ? Intl.DateTimeFormat('vi-VN').format(
                            new Date(employee.user_metadata.birthday)
                          )
                        : 'Chưa cập nhật'}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/employees/${employee.email}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Xem hồ sơ
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center py-4 px-6" colSpan="100%">
                    Không có nhân viên nào thuộc phòng ban{' '}
                    {selectedDepartment.name}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

Employees.title = 'Nhân viên';
Employees.description = 'Nhân viên';
export default withPageAuthRequired(Employees);
