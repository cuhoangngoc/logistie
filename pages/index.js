import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout/Layout';
import NewsCard from '../components/NewsPage/NewsCard';
import { useState, useEffect } from 'react';
import AddNewsCard from '../components/NewsPage/AddNewsCard';
import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

function Home({ user, CLOUDINARY_CLOUD_NAME }) {
  const [news, setNews] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});

  useEffect(() => {
    fetch('../api/news/getAllNews')
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const getSignedInUser = async () => {
      const res = await axios.get(`/api/users/get-user-info?email=${user.email}`);
      setSignedInUser(res.data);
    };
    getSignedInUser();
  }, [user.email]);

  return (
    <Layout user={user}>
      {Boolean(signedInUser.user_metadata?.role) && <AddNewsCard user_id={signedInUser._id} CLOUDINARY_CLOUD_NAME={CLOUDINARY_CLOUD_NAME}/>}

      <div className=''>
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Bản tin công ty</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Cập nhật thông tin mới nhất của công ty tại đây.</p>
        </div>


        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {news.map((news) => (
            <NewsCard
              urlimg={news.imageSrc}
              title={news.title}
              created_at={news.created_at}
              updated_at={news.updated_at}
              key={news._id}
              id={news._id}
              user_id = {news.user_id}
            />
          ))}
        </div>
      </div>


    </Layout>
  );
}

export async function getServerSideProps() {
  // Đọc giá trị biến môi trường từ process.env và truyền vào props
  return {
      props: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
      },
  };
}

export default withPageAuthRequired(Home);
