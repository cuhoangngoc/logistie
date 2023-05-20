import React from 'react'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import Layout from '../../components/Layout/Layout';
import EditNews from '../../components/NewsPage/EditNews';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

function NewsDetail({user}) {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`../../api/news/getNewsByID?id=${id}`)
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error(error));
  }, [id, news]);

  const date = new Date(news.created_at);
  const date_format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const date1 = new Date(news.updated_at);
  const date1_format = `${date1.getDate()}/${date1.getMonth() + 1}/${date1.getFullYear()}`;

  return (
    <Layout user={user}>
      <div className='p-2'>
        <h1 className='text-4xl font-bold my-5'>{news.title}</h1>
        {news.imageSrc && <Image src={news.imageSrc} className='rounded-l-xl' alt={news.title} width="200" height="100"></Image>}
        <p className='my-2'>Ngày tạo: {date_format}</p>
        <p className='my-2'>Ngày chỉnh sửa gần nhất: {date1_format}</p>
        <p dangerouslySetInnerHTML={{ __html: news.content}}></p>
      </div>
      
      {user ? (
          <EditNews id={id} content={news.content} title={news.title} publicId={news.publicId}></EditNews>
        ) : <EditNews id={id} content={news.content} title={news.title} publicId={news.publicId}></EditNews>}
    </Layout>
  );
}

export default withPageAuthRequired(NewsDetail);