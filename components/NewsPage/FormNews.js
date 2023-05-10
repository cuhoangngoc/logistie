import React from 'react'
import { useState, useEffect } from 'react';
import Editor from '../Editor';
import Button from './Button';

const FormNews = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Do something with the title and content here
        console.log(title,content);
        try {
            const res = await fetch(`/api/news/addNews?title=${title}&content=${content}&user_id=1`);
            const data = await res.json();
            console.log(data.message);
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
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block mb-2 font-bold text-gray-700">
                    Content
                </label>
                <Editor getContent={(value) => setContent(value)} />
            </div>
            <div className="flex justify-center">
                <Button
                    text="Thêm"
                    color="blue"
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                ></Button>
            </div>
        </form>
    );
}

export default FormNews