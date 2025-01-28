import React from 'react';

interface TitleProps {
  mainTitle: string;
  subTitle: string;
}

const Title: React.FC<TitleProps> = ({ mainTitle, subTitle }) => {
  return (
    <div className='my-[40px]'>
      <div className="text-center text-white text-[40px] lg:text-[60px] font-bold w-full">{mainTitle}</div>
      <div className="text-center text-white text-[20px] lg:text-[30px] mx-auto w-[90%] lg:w-[90%]">
        {subTitle}
      </div>
    </div>
  );
};

export default Title;
