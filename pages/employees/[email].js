import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../../components/Layout/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Button from '../../components/Button';
import EditInfoModal from '../../components/Employees/edit-info-modal';

const Profile = ({ user }) => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [signedInUserRole, setSignedInUserRole] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      let res = await axios.get(
        `/api/users/get-user-info?email=${router.query.email}`
      );
      setUserProfile(res.data);

      res = await axios.get(`/api/users/get-user-info?email=${user.email}`);
      setSignedInUserRole(res.data.user_metadata.role);
      setLoading(false);
    };

    getUserProfile();
  }, [router.query.email, user.email]);

  if (loading) return <p>Loading...</p>;
  return (
    <Layout user={user}>
      <h1 className="mb-10 text-2xl font-bold">Hồ sơ nhân viên</h1>

      <section>
        <div className="col-span-1 mt-16 w-full rounded-lg bg-white px-8 py-4 shadow-lg ring-1 dark:bg-gray-800">
          <div className="-mt-16 flex justify-center md:justify-start mb-5">
            <Image
              className="h-20 w-20 rounded-full border-2 object-cover"
              src={user.picture}
              alt={user.name}
              width={100}
              height={100}
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:mt-0">
            {userProfile.name}
          </h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <tbody>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">ID</td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    <span className="kbd">{userProfile._id}</span>
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Email
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile.email}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Chức vụ
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile?.user_metadata?.title}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Phòng ban
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile?.user_metadata?.department?.name}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    CCCD
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile?.user_metadata?.cccd}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Ngày vào làm
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {Intl.DateTimeFormat('vi-VN').format(new Date())}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Địa chỉ
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile?.user_metadata?.address ?? 'Chưa cập nhật'}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Ngày sinh
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile?.user_metadata?.birthday
                      ? Intl.DateTimeFormat('vi-VN').format(
                          new Date(userProfile?.user_metadata?.birthday)
                        )
                      : 'Chưa cập nhật'}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    Số điện thoại
                  </td>
                  <td className="text-gray-700 dark:text-gray-400 py-2">
                    {userProfile.user_metadata?.phone_number ?? 'Chưa cập nhật'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="flex justify-between mt-5">
        {/* Edit button. Profile edition not allowed if signedInUser don't have a role of 1 or they are not the original user */}
        {signedInUserRole === 1 || user.email === userProfile.email ? (
          <EditInfoModal userProfile={userProfile} isAdmin={signedInUserRole} />
        ) : null}

        {/* <Button className="bg-error">Xóa</Button> */}
      </section>
    </Layout>
  );
};

export default withPageAuthRequired(Profile);
