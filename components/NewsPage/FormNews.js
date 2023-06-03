import React, { useState } from 'react';
import Editor from '../Editor';
import { showErrorToast, showSuccessToast } from '../../components/Toast';
import { useRouter } from 'next/router';

const FormNews = ({ user_id, CLOUDINARY_CLOUD_NAME }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const router = useRouter();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }
    formData.append('upload_preset', 'logistie_news_uploads');
    let public_id = '';
    if (fileInput.files.length > 0) {
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        setUploadData(res);
        const data = await res.json();
        setImageSrc(data.secure_url);
        public_id = data.public_id;
      } catch (error) {
        console.log(error);
      }
    }

    try {
      // Gửi yêu cầu POST đến API để lưu bản tin và URL hình ảnh
      const res = await fetch(`/api/news/addNews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          imageSrc,
          publicId: public_id,
          user_id: user_id,
        }),
      });
      const data1 = await res.json();
      console.log(data1.message);
      showSuccessToast('Thêm bản tin thành công');
      setTimeout(() => {
        // Nếu người dùng cố tình không chuyển hướng, chuyển hướng sau 5 giây
        router.push('/');

        // nếu người dùng chuyển hướng, hủy hàm setTimeout
        return () => clearTimeout();
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="px-3" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block font-bold text-gray-700">
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="focus:shadow-outline w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="mb-2 block font-bold text-gray-700">
          Nội dung
        </label>
        <Editor getContent={(value) => setContent(value)} />
      </div>
      <div className="mb-4">
        <p>
          <input type="file" name="file" onChange={handleOnChange} accept="image/*" />
        </p>

        <img src={imageSrc} />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="focus:shadow-outline-blue btn rounded bg-success px-4 py-2 text-white focus:outline-none"
          data-hs-overlay="#hs-vertically-centered-scrollable-modal"
        >
          Thêm
        </button>
      </div>
    </form>
  );
};

export default FormNews;
