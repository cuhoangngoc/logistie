import Lottie from 'lottie-react';
import * as Loader from '../public/loading.json';

const Spinner = () => {
  return (
    <>
      <div className="w-full h-screen bg-transparent flex justify-center items-center">
        <div className="md:w-[15rem] md:h-[15rem] w-[7rem] h-[7rem]">
          <Lottie animationData={Loader} loop={true} />
        </div>
      </div>
    </>
  );
};

export default Spinner;
