import React, { useState } from 'react';
import Editor from '../Editor';

function FormNews() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();

    function handleOnChange(changeEvent) {
        const reader = new FileReader();

        reader.onload = function (onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
            setUploadData(undefined);
        }

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
        formData.append('upload_preset', 'my-uploads');
        let public_id = "";
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/logistie/image/upload', {
                method: 'POST',
                body: formData
            });
            setUploadData(res);
            const data = await res.json();
            setImageSrc(data.secure_url);
            public_id = data.public_id;
        } catch (error) {
            console.log(error);
        }

        try {
            // Gửi yêu cầu POST đến API để lưu bản tin và URL hình ảnh
            const res = await fetch(`/api/news/addNews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    imageSrc,
                    publicId: public_id,
                    user_id: 1,
                }),
            });
            const data1 = await res.json();
            console.log(data1.message);
            alert("Đã thêm bản tin thành công!");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <form className='px-3' onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-bold text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block mb-2 font-bold text-gray-700">
                    Content
                </label>
                <Editor getContent={(value) => setContent(value)} />
            </div>
            <div className="mb-4">
                <p>
                    <input type="file" name="file" onChange={handleOnChange} />
                </p>

                <img src={imageSrc} />

                {imageSrc && !uploadData && (
                    <p>
                        <button>Upload Files</button>
                    </p>
                )}

                {uploadData && (
                    <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
                )}
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                >Thêm</button>
            </div>
        </form>
    );
}

export default FormNews;