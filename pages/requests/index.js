import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../../components/Layout/Layout';
import AddReqModal from '../../components/Requests/AddReqModal';
import axios from 'axios';
import ReqInfoModal from '../../components/Requests/ReqInfoModal';
import { useEffect, useState } from 'react';
import color from '../../lib/highlight-status';
import Link from 'next/link';

export async function getServerSideProps(context) {
  // get all departments
  const departments = await axios.get(`${process.env.API_URL}/departments/list-department`);

  // get all requests, group by department
  const requests = await axios.get(`${process.env.API_URL}/requests/list-all-requests`);

  return {
    props: {
      departments: departments.data,
      requests: requests.data,
    },
  };
}

const Request = ({ user, departments, requests }) => {
  const [myRequests, setMyRequests] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [reqs, setReqs] = useState(requests);

  useEffect(() => {
    const getMyRequests = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/list-request?user_id=${
          user.sub.split('|')[1]
        }`
      );
      setMyRequests(res.data);
    };

    const getUserProfile = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/get-user-info?email=${user.email}`
      );
      setUserProfile(res.data);
    };

    getMyRequests();
    getUserProfile();
  }, [user.sub, user.email]);

  const handleChangeDep = async (e) => {
    if (e.target.value === 'all') {
      setReqs(requests);
      return;
    }

    const result = requests.filter((req) => req.department_id === e.target.value);
    setReqs(result);
  };

  return (
    <Layout user={user}>
      <h1 className="mb-10 text-2xl font-bold">Quản lý yêu cầu</h1>
      <section>
        <AddReqModal user={user} departments={departments} />

        {/* show all current user's request */}
        <div className="mt-10 overflow-x-auto">
          <h3 className="mb-5 text-xl font-bold">Yêu cầu của bạn</h3>
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Phòng ban tiếp nhận</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req, i) => (
                <tr key={req._id}>
                  <td>{i + 1}</td>
                  <td>{req.title.slice(10)}</td>
                  <td>{req.department.name}</td>
                  <td className={`${color[req.status]}`}>{req.status}</td>
                  <td>
                    {/* <ReqInfoModal request={req} /> */}
                    <Link href={`/requests/${req._id}`} className="text-primary underline">
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* show all requests */}

      {Boolean(userProfile?.user_metadata?.role) && (
        <section className="mt-10">
          <h3 className="mb-5 text-xl font-bold">Tất cả yêu cầu</h3>
          <select
            name="department"
            id="department"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={handleChangeDep}
          >
            <option value="all">Tất cả</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>
          <div className="mt-10 overflow-x-auto">
            <table className="table-zebra table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tiêu đề</th>
                  <th>Phòng ban tiếp nhận</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reqs.length > 0 ? (
                  reqs.map((req, i) => (
                    <tr key={req._id}>
                      <td>{i + 1}</td>
                      <td>{req.title}</td>
                      <td>{req.department.name}</td>
                      <td className={`${color[req.status]}`}>{req.status}</td>
                      <td>
                        {/* <ReqInfoModal request={req} /> */}
                        <Link href={`/requests/${req._id}`} className="text-primary underline">
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không có yêu cầu nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default withPageAuthRequired(Request);
