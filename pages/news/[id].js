import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import EditNews from '../../components/NewsPage/EditNews';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import axios from 'axios';
import defaultavatarimg from '../../public/imgs/newspage/defaultavatarimg.jpg';
import Spinner from '../../components/Spinner';

function NewsDetail({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});
  const [userinfo, setUser] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [dateFormat1, setDateFormat1] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`../../api/news/getNewsByID?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
        sessionStorage.setItem('news', JSON.stringify(data));
        setDateFormat(Intl.DateTimeFormat('vi-VN').format(new Date(news?.created_at)));
        setDateFormat1(Intl.DateTimeFormat('vi-VN').format(new Date(news?.updated_at)));
      })
      .catch((error) => console.error(error));

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/get-user-by-id?id=${news.user_id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const userData = await response.json();
        setUser(userData);
        console.log(userData);
        return userData;
      } catch (error) {
        console.error(error);
      }
    };

    const getSignedInUser = async () => {
      const res = await axios.get(`/api/users/get-user-info?email=${user.email}`);
      setSignedInUser(res.data);
    };

    getSignedInUser();
    // Gọi hàm fetchUserData với id người dùng
    fetchUserData();
  }, [id, news.created_at, news.updated_at, news.user_id, user.email]);

  return (
    <Layout user={user}>
      {loading && <Spinner />}
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="my-5 mt-auto flex items-center gap-x-3 md:my-5">
          {userinfo.picture && (
            <Image
              className="h-8 w-8 rounded-full"
              src={userinfo.picture}
              alt="Image Description"
            />
          )}
          {!userinfo.picture && (
            <Image
              className="h-8 w-8 rounded-full"
              src={defaultavatarimg}
              alt="Image Description"
            />
          )}
          <div>
            <h5 className="text-sm text-gray-800 dark:text-gray-200">By {userinfo.username}</h5>
          </div>
        </div>

        <div className="space-y-5 md:space-y-8">
          <h1 className="text-2xl font-bold dark:text-white md:text-3xl">{news.title}</h1>

          <ul className="text-base text-gray-500">
            <li className="relative inline-block pr-6 before:absolute before:right-2 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-300 last:pr-0 last-of-type:before:hidden dark:text-gray-400 dark:before:bg-gray-600">
              Ngày tạo: {dateFormat}
            </li>
            <br></br>
            <li className="relative inline-block pr-6 before:absolute before:right-2 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-300 last:pr-0 last-of-type:before:hidden dark:text-gray-400 dark:before:bg-gray-600">
              Ngày chỉnh sửa gần nhất: {dateFormat1}
            </li>
          </ul>

          {news.imageSrc && (
            <Image
              src={news.imageSrc}
              className="w-full rounded-xl object-cover"
              alt={news.title}
              width="1080"
              height="500"
            ></Image>
          )}
          <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
        </div>
      </div>

      {Boolean(signedInUser.user_metadata?.role) && !loading && (
        <EditNews id={id} content={news.content} title={news.title} publicId={news.publicId} />
      )}
    </Layout>
  );
}

export default withPageAuthRequired(NewsDetail);
