import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-4 sm:mt-8">
      <p className="text-xs sm:text-base md:text-lg text-gray-600">
      🚀 프로젝트의 <b><a href="https://github.com/siniseong/suuk" className="text-blue-500">레포지토리</a></b>와 <b><a href="https://siniseong.notion.site/SSUK-149e00310b39806aba20fc5bf3657cc3?pvs=4" className="text-blue-500">노션</a></b>을 구경해보세요.
      </p>
    </footer>
  );
};

export default Footer;