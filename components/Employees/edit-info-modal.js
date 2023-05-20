import { useState, useEffect } from 'react';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../Toast';

const EditInfoModal = ({
  userProfile,
  isAdmin,
  cloudinaryConfig: { uploadEnpoint, uploadPreset },
}) => {
  const [phone, setPhone] = useState(userProfile.user_metadata?.phone_number);
  const [address, setAddress] = useState(userProfile.user_metadata?.address);
  const [birthday, setBirthday] = useState(userProfile.user_metadata?.birthday);
  const [title, setTitle] = useState(userProfile.user_metadata?.title);
  const [titles, setTitles] = useState([]);
  const [cccd, setCccd] = useState(userProfile.user_metadata?.cccd);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTitles = async () => {
      if (!userProfile.user_metadata.department_id) return;

      const res = await axios.get(`/api/departments/${userProfile.user_metadata.department_id}`);
      setTitles(res.data.titles);
    };

    fetchTitles();
  }, [userProfile.user_metadata.department_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let picture = userProfile.picture;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      const response = await axios.post(uploadEnpoint, formData);
      picture = response.data.secure_url;
    }

    const user_metadata = {
      phone_number: phone,
      address,
      birthday,
      title,
      cccd,
    };

    const res = await axios.patch(`/api/users/${userProfile.email}`, {
      user_metadata,
      picture,
    });

    if (res.status !== 200) {
      showErrorToast('Cập nhật thất bại');
      return;
    }

    showSuccessToast('Cập nhật thành công');
    document.getElementById('edit-info-modal').checked = false; // Hide the modal
  };

  const handleFileChange = (event) => {
    setFile(event.target?.files[0]);
  };

  return (
    <>
      {/* The button to open modal */}
      <label htmlFor="edit-info-modal" className="btn bg-info text-white">
        Chỉnh sửa
      </label>

      <input type="checkbox" id="edit-info-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Chỉnh sửa hồ sơ nhân viên</h3>

          <div className="py-4">
            {/* Edit profile form */}
            <form className="max-w-sm mx-auto">
              <div className="">
                <div className="mb-5">
                  <label
                    htmlFor="picture"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Ảnh đại diện
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="file"
                        name="picture"
                        id="picture"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-5">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="address"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Số nhà, đường, phường, quận, thành phố"
                        defaultValue={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Birthday */}
                <div className="mb-5">
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Ngày sinh
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="date"
                        name="birthday"
                        id="birthday"
                        autoComplete="birthday"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue={birthday?.slice(0, 10)}
                        onChange={(e) => {
                          setBirthday(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Số điện thoại
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="phone"
                        name="phone-number"
                        id="phone-number"
                        autoComplete="phone-number"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="0123456789"
                        defaultValue={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Chức vụ
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <select
                        name="title"
                        id="title"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={!isAdmin} // disabled if the login user is not admin (user with role of 1)
                      >
                        <option value="">Chọn chức vụ</option>
                        {titles.map((title, i) => (
                          <option
                            key={i}
                            value={title.name}
                            disabled={title.number_of_employees >= title.capacity}
                          >
                            {title.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="cccd"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    CCCD
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="phone"
                        name="cccd"
                        id="cccd"
                        autoComplete="cccd"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-disabled disabled:rounded-md"
                        placeholder="012345678999"
                        defaultValue={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                        disabled={!isAdmin} // disabled if the login user is not admin (user with role of 1)
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-action">
            <label htmlFor="edit-info-modal" className="btn bg-error text-white">
              Đóng
            </label>

            <button type="submit" className="btn bg-success text-white" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInfoModal;
