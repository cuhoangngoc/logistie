import React from 'react';
import { useState, useEffect } from 'react';
import Editor from '../Editor';

const FormEditNews = ({ id, content, title }) => {
    const [newTitle, setNewTitle] = useState(title);
    const [newContent, setNewContent] = useState(content);

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    };

    const handleContentChange = (value) => {
        setNewContent(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Do something with the title and content here
        try {
            const res = await fetch(`/api/news/editNews?id=${id}&title=${newTitle}&content=${newContent}`, {
                method: 'PUT',
            });
            const data = await res.json();
            console.log(data.message);
            alert("Đã cập nhật bản tin thành công!");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Title
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    value={newTitle}
                    onChange={handleTitleChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Content
                </label>
                <Editor getContent={handleContentChange} defaultValue={newContent} />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                Cập nhật
            </button>
        </form>
    );
};

export default FormEditNews;