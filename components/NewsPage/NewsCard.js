import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NewsCard = ({ id, urlimg, title, created_at, updated_at }) => {
  const date = new Date(created_at);
  const date_format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const date1 = new Date(updated_at);
  const date1_format = `${date1.getDate()}/${date1.getMonth() + 1}/${date1.getFullYear()}`;
  return (
    <div>
      <Link className='flex flex-wrap rounded-xl border-2 border-blue-500 h-40' href={`/news/${id}`}>
        <div className='w-full md:w-1/2 lg:w-1/2'>
          {urlimg && <Image src={urlimg} className='rounded-l-xl p-1' alt={title} width="300" height="200"></Image>}
        </div>
        <div className='w-full md:w-1/2 lg:w-1/2 text-black p-3'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <p className='text-lg'>Ngày tạo: {date_format}</p>
          <p className='text-lg'>Ngày chỉnh sửa: {date1_format}</p>
        </div>
      </Link>
    </div>

  )
}

export default NewsCard