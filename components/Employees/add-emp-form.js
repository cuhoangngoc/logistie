import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showSuccessToast, showErrorToast } from '../../components/Toast';
import axios from 'axios';
import registerValidation from '../../validation/register-validation';
import askForToken from '../../lib/ask-for-token';

const AddEmpForm = ({ departments }) => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [cccd, setCccd] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      username,
      password,
      passwordConfirmation,
      fullName,
      title,
      cccd,
      department,
    };

    const { error, message } = registerValidation(data);

    if (error) {
      showErrorToast(message);
      return;
    }

    // Create user in Auth0
    const body = {
      email,
      username,
      name: fullName,
      password,
      connection: 'Logistie',
      verify_email: false,
      user_metadata: {
        title,
        cccd,
        department_id: department,
        role: 0,
      },
    };

    let response = await axios.post('/api/users/save-user', body);

    if (response.status !== 200) {
      showErrorToast(response.data.message);
      return;
    }

    // Add user to the employees array of the corresponding department
    const departmentOptions = {
      method: 'PATCH',
      url: `/api/departments/${department}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_id: response.data.user_id,
      },
    };

    response = await axios.request(departmentOptions);
    if (response.status !== 200) {
      showErrorToast(response.data.message);
      return;
    }

    showSuccessToast('Tạo nhân viên thành công');
    setShowForm(false);
  };

  return (
    <>
      <button
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setShowForm(!showForm)}
      >
        Thêm nhân viên
      </button>

      {showForm && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto outline-none transition-all duration-200 focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">
                    Thêm vào một nhân viên mới
                  </h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-6">
                  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                      <form
                        className="space-y-6"
                        action="#"
                        method="POST"
                        onSubmit={handleSubmit}
                      >
                        <div className="flex justify-between gap-2">
                          <div>
                            <label
                              htmlFor="fullname"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Họ tên
                            </label>
                            <div className="mt-2">
                              <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                autoComplete="fullname"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setFullName(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="fullname"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Username
                            </label>
                            <div className="mt-2">
                              <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Địa chỉ email
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Chức vụ
                          </label>
                          <div className="mt-2">
                            <input
                              id="title"
                              name="title"
                              type="text"
                              autoComplete="title"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-between">
                          <div>
                            <label
                              htmlFor="cccd"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Căn cước công dân
                            </label>
                            <div className="mt-2">
                              <input
                                id="cccd"
                                name="cccd"
                                type="text"
                                autoComplete="cccd"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setCccd(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="department"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Phòng ban
                            </label>
                            <div className="mt-2">
                              <select
                                name="department"
                                id="department"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(e) => setDepartment(e.target.value)}
                              >
                                <option value="">Chọn phòng ban</option>
                                {departments.map((department) => (
                                  <option
                                    key={department._id}
                                    value={department._id}
                                  >
                                    {department.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Mật khẩu
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="password_confirmation"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Xác nhận mật khẩu
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              autoComplete="password_confirmation"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Thêm
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </>
  );
};

export default AddEmpForm;
