import React, {useState} from 'react';
import Button from './Button';
import FormNews from './FormNews';

const AddNewsCard = () => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <div className="rounded-xl border-2 border-blue-500 mb-5">
      <Button text="Thêm bản tin" color="green" onClick={() => setIsShowing(!isShowing)} />

      {isShowing && <FormNews/>}
    </div>
  );
};

export default AddNewsCard; 