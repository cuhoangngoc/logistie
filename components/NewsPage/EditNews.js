import React, { useState } from 'react'
import Button from './Button'
import FormEditNews from './FormEditNews'

const EditNews = ({ id, content, title }) => {
    const [isShowing, setIsShowing] = useState(false);

    const handleDeleteClick = async () => {
        fetch(`/api/news/deleteNews?id=${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Nếu thành công, hiển thị thông báo và làm gì đó khác nếu cần
                    alert('Xóa bản tin thành công!');
                    window.location.href = "/";
                } else {
                    // Nếu có lỗi, hiển thị thông báo lỗi
                    alert('Đã có lỗi xảy ra khi xóa bản tin!');
                }
            })
            .catch(error => {
                // Nếu có lỗi, hiển thị thông báo lỗi
                alert('Đã có lỗi xảy ra khi xóa bản tin!');
                console.error(error);
            });
    };

    return (
        <div>
            <Button text="Sửa bản tin" color="blue" onClick={() => setIsShowing(!isShowing)} />
            <Button text="Xóa bản tin" color="red" onClick={handleDeleteClick} />
            {isShowing && <FormEditNews id={id} content={content} title={title}/>}
        </div>
    )
}

export default EditNews