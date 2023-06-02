import style from './requests.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '../Toast';

const AddReqModal = ({ user, departments }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');

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

    showSuccessToast('Gửi yêu cầu thành công');
    document.getElementById('add-request-modal').checked = false; // Hide the modal
  };
  return (
    <>
      {/* The button to open modal */}
      <label htmlFor="add-request-modal" className="btn btn-primary text-white">
        Gửi yêu cầu
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="add-request-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Gửi yêu cầu của bạn</h3>

          <form action="" className="max-w-md mx-auto">
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
                  className={`${style.label} peer-focus:text-primary peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4`}
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
                  className={`${style.label} peer-focus:text-primary peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4`}
                >
                  Mô tả
                </label>
              </div>

              {/* select department */}
              <select
                name="department"
                id="department"
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            <label htmlFor="add-request-modal" className="btn btn-error">
              Đóng
            </label>
            <button
              type="submit"
              className="btn btn-success text-white"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReqModal;
