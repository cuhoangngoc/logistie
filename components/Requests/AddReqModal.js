import style from './requests.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '../Toast';
import { useRouter } from 'next/router';
import { set } from 'mongoose';

const AddReqModal = ({ user, departments }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // create new request
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/create-request`,
      {
        title,
        description,
        department,
        user_id: user.sub.split('|')[1],
      }
    );

    if (res.status !== 200) {
      showErrorToast('Có lỗi xảy ra');
      return;
    }

    document.getElementById('add-request-modal').checked = false; // Hide the modal

    router.reload();

    setTimeout(() => {
      showSuccessToast('Gửi yêu cầu thành công');
    }, 0);
  };
  return (
    <>
      {/* The button to open modal */}
      <label htmlFor="add-request-modal" className="btn-primary btn text-white">
        Gửi yêu cầu
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="add-request-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="text-lg font-bold">Gửi yêu cầu của bạn</h3>

          <form action="" className="mx-auto max-w-md">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  aria-describedby="title_help"
                  className={`${style.input} peer`}
                  placeholder=" "
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label
                  htmlFor="title"
                  className={`${style.label} peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary`}
                >
                  Tiêu đề
                </label>
              </div>

              {/* request description */}
              <div className="relative">
                <textarea
                  type="text"
                  id="description"
                  aria-describedby="description_help"
                  className={`${style.input} peer`}
                  placeholder=" "
                  rows={5}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label
                  htmlFor="description"
                  className={`${style.label} peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary`}
                >
                  Mô tả
                </label>
              </div>

              {/* select department */}
              <select
                name="department"
                id="department"
                className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Đến đơn vị</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="modal-action">
            <label htmlFor="add-request-modal" className="btn-error btn">
              Đóng
            </label>
            <button type="submit" className="btn-success btn text-white" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReqModal;
