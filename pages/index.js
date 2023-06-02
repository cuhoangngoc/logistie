import Layout from '../components/Layout/Layout';
import NewsCard from '../components/NewsPage/NewsCard';
import { useState, useEffect } from 'react';
import AddNewsCard from '../components/NewsPage/AddNewsCard';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Spinner from '../components/Spinner';

function Home({ user, CLOUDINARY_CLOUD_NAME, news }) {
  const [signedInUser, setSignedInUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSignedInUser = async () => {
      const res = await axios.get(`/api/users/get-user-info?email=${user.email}`);
      setSignedInUser(res.data);
      setLoading(false);
    };
    getSignedInUser();
  }, [user.email]);

  return (
    <Layout user={user}>
      {loading && <Spinner />}
      {Boolean(signedInUser.user_metadata?.role) && (
        <AddNewsCard user_id={signedInUser._id} CLOUDINARY_CLOUD_NAME={CLOUDINARY_CLOUD_NAME} />
      )}

      <div className="">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <h2 className="text-2xl font-bold dark:text-white md:text-4xl md:leading-tight">
            Bản tin công ty
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Cập nhật thông tin mới nhất của công ty tại đây.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((news) => (
            <NewsCard
              urlimg={news.imageSrc}
              title={news.title}
              created_at={news.created_at}
              updated_at={news.updated_at}
              key={news._id}
              id={news._id}
              user_id={news.user_id}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // get all news
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/getAllNews`);

  // Đọc giá trị biến môi trường từ process.env và truyền vào props
  return {
    props: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      news: res.data,
    },
  };
}

export default withPageAuthRequired(Home);
