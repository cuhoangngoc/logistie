import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import defaultnewsimg from '../../public/imgs/newspage/defaultnewstimg.png'
import defaultavatarimg from '../../public/imgs/newspage/defaultavatarimg.jpg'

const NewsCard = ({ id, urlimg, title, created_at, updated_at, user_id }) => {
  const [ user, setUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/get-user-by-id?id=${user_id}`, {
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
  }, []);

  const date = new Date(created_at);
  const date_format = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const date1 = new Date(updated_at);
  const date1_format = `${date1.getDate()}/${date1.getMonth() + 1}/${date1.getFullYear()}`;
  return (
    <Link className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 dark:border-gray-700 dark:hover:border-transparent dark:hover:shadow-black/[.4]" href={`/news/${id}`}>
      <div className='aspect-w-16 aspect-h-11'>
        {urlimg && <Image src={urlimg} className='w-full object-cover rounded-xl' alt={title} width="300" height="200"></Image>}
        {!urlimg && <Image src={defaultnewsimg} className='w-full object-cover rounded-xl' alt={title} width="300" height="200"></Image>}
      </div>

      <div className='my-6'>
        <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-300 dark:group-hover:text-white'>{title}</h1>
        <p className='mt-5 text-gray-600 dark:text-gray-400'>Ngày tạo: {date_format}</p>
        <p className='mt-5 text-gray-600 dark:text-gray-400'>Ngày chỉnh sửa: {date1_format}</p>
      </div>

      <div className='mt-auto flex items-center gap-x-3'>
        {user.picture && <Image className="w-8 h-8 rounded-full" src={user.picture} alt="Image Description" />}
        {!user.picture && <Image className="w-8 h-8 rounded-full" src={defaultavatarimg} alt="Image Description" />}
        <div>
          <h5 className="text-sm text-gray-800 dark:text-gray-200">By {user.username}</h5>
        </div>
      </div>
    </Link>

  )
}

export default NewsCard