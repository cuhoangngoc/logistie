import React, {useState} from 'react';
import Button from './Button';
import FormNews from './FormNews';

const AddNewsCard = ({user_id, CLOUDINARY_CLOUD_NAME}) => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <div className="mb-5">
      <div className='flex justify-end'>
        <Button text="Thêm bản tin" color="green" onClick={() => setIsShowing(!isShowing)} />
      </div>

      {isShowing && <FormNews user_id={user_id} CLOUDINARY_CLOUD_NAME={CLOUDINARY_CLOUD_NAME}/>}
    </div>
  );
};

export default AddNewsCard; 