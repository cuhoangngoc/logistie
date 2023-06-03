import Lottie from 'lottie-react';
import * as Loader from '../public/loading.json';

const Spinner = () => {
  return (
    <div className="fixed left-0 top-0 z-[100] flex h-screen w-full items-center justify-center bg-gray-300 bg-opacity-80">
      <div className="h-[7rem] w-[7rem] md:h-[15rem] md:w-[15rem]">
        <Lottie animationData={Loader} loop={true} />
      </div>
    </div>
  );
};

export default Spinner;
