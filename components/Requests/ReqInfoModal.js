import { useState, useEffect } from 'react';
import color from '../../lib/highlight-status';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../Toast';

const ReqInfoModal = ({ request }) => {
  const [transferTo, setTransferTo] = useState(null);
  const [comment, setComment] = useState('');
  const [departments, setDepartments] = useState([]);
  const color = {
    pending: 'text-yellow-500',
    approved: 'text-green-500',
    rejected: 'text-red-500',
    transferred: 'text-blue-500',
  };
  useEffect(() => {
    // get all departments
    const getDepartments = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/departments/list-department`
      );
      setDepartments(res.data);
    };
    getDepartments();
  }, []);

  const handleTransfering = async () => {
    if (!transferTo) {
      showErrorToast('Vui lòng chọn phòng ban tiếp nhận');
      return;
    }

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/transfer-request`,
      {
        request_id: request._id,
        department_id: transferTo,
      }
    );
    if (res.status === 200) showSuccessToast('Chuyển phòng ban thành công');
    else showErrorToast('Chuyển phòng ban thất bại');

    // close modal
    document.getElementById('request-info-modal').checked = false;
  };

  const handleRejection = async () => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/reject-request`, {
      request_id: request._id,
      comment,
    });
    if (res.status === 200) showSuccessToast('Đã từ chối yêu cầu');
    else showErrorToast('Từ chối yêu cầu thất bại');

    // close modal
    document.getElementById('request-info-modal').checked = false;
  };

  const handleApproval = async () => {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/approve-request`,
      {
        request_id: request._id,
        comment,
      }
    );
    if (res.status === 200) showSuccessToast('Đã phê duyệt yêu cầu');
    else showErrorToast('Phê duyệt yêu cầu thất bại');

    // close modal
    document.getElementById('request-info-modal').checked = false;
  };

  return (
    <>
      {/* The button to open modal */}
      <label htmlFor="request-info-modal" className="cursor-pointer text-primary underline">
        Xem chi tiết
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="request-info-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div>
            <h3 className="text-xl font-bold">Thông tin yêu cầu</h3>

            <div className="mt-5">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">Tiêu đề:</p>
                  <p>{request.title}</p>

                  <p className="font-bold">Nội dung:</p>
                  <p>{request.description}</p>

                  <p className="font-bold">Phòng ban tiếp nhận:</p>
                  <p>{request.department.name}</p>

                  <p className="font-bold">Người yêu cầu:</p>
                  <p>{request.user_id}</p>

                  <p className="font-bold">Ngày yêu cầu:</p>
                  <p>
                    {Intl.DateTimeFormat('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    }).format(new Date(request.created_at))}
                  </p>

                  <p className="font-bold">Trạng thái:</p>
                  <p className={`${color[request.status]}`}>{request.status}</p>

                  {request.comment && (
                    <>
                      <p className="font-bold">Phản hồi:</p>
                      <p>{request.comment}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {(request.status === 'pending' || request.status === 'transferred') && (
            <div className="hs-accordion-group mt-4" data-hs-accordion-always-open>
              <div className="hs-accordion active" id="hs-basic-always-open-heading-one">
                <button
                  className="hs-accordion-toggle inline-flex w-full items-center gap-x-3 py-3 text-left font-semibold text-gray-800 transition hover:text-gray-500 hs-accordion-active:text-blue-600 dark:text-gray-200 dark:hover:text-gray-400 dark:hs-accordion-active:text-blue-500"
                  aria-controls="hs-basic-always-open-collapse-one"
                >
                  <svg
                    className="block h-3 w-3 text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.62421 7.86L13.6242 7.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.12421 13.36V2.35999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <svg
                    className="hidden h-3 w-3 text-gray-600 group-hover:text-gray-500 hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.62421 7.86L13.6242 7.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Phê duyệt / Từ chối
                </button>
                <div
                  id="hs-basic-always-open-collapse-one"
                  className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                  aria-labelledby="hs-basic-always-open-heading-one"
                >
                  <div>
                    {/* comment */}
                    <textarea
                      name="comment"
                      id="comment"
                      rows="5"
                      className="w-full"
                      placeholder="Phản hồi"
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <div className="flex justify-between">
                      <button className="btn-success btn" onClick={handleApproval}>
                        Phê duyệt
                      </button>
                      <button className="btn-error btn" onClick={handleRejection}>
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hs-accordion" id="hs-basic-always-open-heading-two">
                <button
                  className="hs-accordion-toggle inline-flex w-full items-center gap-x-3 py-3 text-left font-semibold text-gray-800 transition hover:text-gray-500 hs-accordion-active:text-blue-600 dark:text-gray-200 dark:hover:text-gray-400 dark:hs-accordion-active:text-blue-500"
                  aria-controls="hs-basic-always-open-collapse-two"
                >
                  <svg
                    className="block h-3 w-3 text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.62421 7.86L13.6242 7.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.12421 13.36V2.35999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <svg
                    className="hidden h-3 w-3 text-gray-600 group-hover:text-gray-500 hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.62421 7.86L13.6242 7.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Chuyển đơn vị
                </button>
                <div
                  id="hs-basic-always-open-collapse-two"
                  className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                  aria-labelledby="hs-basic-always-open-heading-two"
                >
                  <div>
                    <select
                      className="mb-4 block w-full rounded-md border-gray-200 px-4 py-3 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 sm:p-4"
                      onChange={(e) => setTransferTo(e.target.value)}
                    >
                      <option value="">Chọn đơn vị</option>
                      {departments.map(
                        (department) =>
                          // disable current department
                          department._id !== request.department._id && (
                            <option key={department._id} value={department._id}>
                              {department.name}
                            </option>
                          )
                      )}
                    </select>
                    <button className="btn-info btn" onClick={handleTransfering}>
                      Chuyển đơn vị
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="modal-action">
            <label htmlFor="request-info-modal" className="btn-error btn">
              Đóng
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReqInfoModal;
