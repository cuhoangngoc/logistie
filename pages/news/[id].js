import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import Layout from '../../components/Layout/Layout';
import EditNews from '../../components/NewsPage/EditNews';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import axios from 'axios';
import defaultavatarimg from '../../public/imgs/newspage/defaultavatarimg.jpg'

function NewsDetail({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});
  const [userinfo, setUser] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [dateFormat1, setDateFormat1] = useState("");

  useEffect(() => {
    fetch(`../../api/news/getNewsByID?id=${id}`)
      .then(response => response.json())
      .then(data => {setNews(data);
        setDateFormat(Intl.DateTimeFormat('vi-VN').format(new Date(news.created_at)));
        setDateFormat1(Intl.DateTimeFormat('vi-VN').format(new Date(news.updated_at)))})
      .catch(error => console.error(error));
  }, [id, news]);

  useEffect(() => {
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
    
    // Gọi hàm fetchUserData với id người dùng
    fetchUserData();
  }, [news.user_id]);

  useEffect(() => {
    const getSignedInUser = async () => {
      const res = await axios.get(`/api/users/get-user-info?email=${user.email}`);
      setSignedInUser(res.data);
    };
    getSignedInUser();
  }, [user.email]);

  /*const date_format = Intl.DateTimeFormat('vi-VN').format(new Date(news.created_at));
  const date1_format = Intl.DateTimeFormat('vi-VN').format(new Date(news.updated_at));*/

  return (
    <Layout user={user}>
      <div className='max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto'>
        <div className='mt-auto flex items-center gap-x-3 my-5 md:my-5'>
          {userinfo.picture && <Image className="w-8 h-8 rounded-full" src={userinfo.picture} alt="Image Description" />}
          {!userinfo.picture && <Image className="w-8 h-8 rounded-full" src={defaultavatarimg} alt="Image Description" />}
          <div>
            <h5 className="text-sm text-gray-800 dark:text-gray-200">By {userinfo.username}</h5>
          </div>
        </div>

        <div className='space-y-5 md:space-y-8'>
          <h1 className='text-2xl font-bold md:text-3xl dark:text-white'>{news.title}</h1>

          <ul className='text-base text-gray-500'>
            <li className='inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600'>Ngày tạo: {dateFormat}</li>
            <br></br>
            <li className='inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600'>Ngày chỉnh sửa gần nhất: {dateFormat1}</li>
          </ul>

          {news.imageSrc && <Image src={news.imageSrc} className='w-full object-cover rounded-xl' alt={news.title} width="1080" height="500"></Image>}
          <div dangerouslySetInnerHTML={{ __html: news.content }}></div>
        </div>
      </div>

      {Boolean(signedInUser.user_metadata?.role) && <EditNews id={id} content={news.content} title={news.title} publicId={news.publicId} />}
    </Layout>
  );
}

export default withPageAuthRequired(NewsDetail);