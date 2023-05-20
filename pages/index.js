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

function Home({ user }) {
  const [news, setNews] = useState([]);
  const [signedInUser, setSignedInUser] = useState({});

  useEffect(() => {
    fetch('../api/news/getAllNews')
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Layout user={user}>
      {user ? (
          <AddNewsCard></AddNewsCard>
        ) : <AddNewsCard></AddNewsCard>}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {news.map((news) => (
          <NewsCard
            urlimg={news.imageSrc}
            title={news.title}
            created_at={news.created_at}
            updated_at={news.updated_at}
            key={news._id}
            id={news._id}
          />
        ))}
      </div>
    </Layout>
  );
}
export default withPageAuthRequired(Home);
