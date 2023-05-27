import React, { useState } from 'react'
import Button from './Button'
import FormEditNews from './FormEditNews'
import crypto from "crypto";
import { useRouter } from 'next/router';

const EditNews = ({ id, content, title, publicId, cloudName, apiKey, apiSecret }) => {
    const router = useRouter();
    const [isShowing, setIsShowing] = useState(false);

    const generateSHA1 = (data) => {
        const hash = crypto.createHash('sha1');
        hash.update(data);
        return hash.digest('hex');
    };
    const timestamp = new Date().getTime();

    const generateSignature = (ID, apiSecret) => {
        return `public_id=${ID}&timestamp=${timestamp}${apiSecret}`;
    };

    const handleDeleteImage = async () => {
        const signature = generateSHA1(generateSignature(publicId, apiSecret));
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    signature: signature,
                    api_key: apiKey,
                    timestamp: timestamp,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Image deleted successfully:', data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/api/news/deleteNews?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {

                // Nếu thành công, hiển thị thông báo và làm gì đó khác nếu cần
                router.push("/");
                alert('Xóa bản tin thành công!');
                // Xóa hình ảnh
                await handleDeleteImage();

            } else {
                // Nếu có lỗi, hiển thị thông báo lỗi
                alert('Đã có lỗi xảy ra khi xóa bản tin!');
            }
        } catch (error) {
            // Nếu có lỗi, hiển thị thông báo lỗi
            alert('Đã có lỗi xảy ra khi xóa bản tin!');
            console.error(error);
        }
    };


    return (
        <div>
            <div className='flex justify-end'>
                <Button text="Sửa bản tin" color="blue" onClick={() => setIsShowing(!isShowing)} />
                <Button text="Xóa bản tin" color="red" onClick={handleDeleteClick} />
            </div>

            {isShowing && <FormEditNews id={id} content={content} title={title} />}
        </div>

    )
}
export async function getServerSideProps() {
    // Đọc giá trị biến môi trường từ process.env và truyền vào props
    return {
        props: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET
        },
    };
}

export default EditNews