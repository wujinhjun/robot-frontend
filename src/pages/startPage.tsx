import { useState, useEffect } from 'react';

import { NavLink } from 'react-router-dom';

import grandmaPng from '@/assets/free-icon-grandmother-375303.png';

export default function StartPage() {
  const [isFullScreen, setFullScreen] = useState(false);

  // 进入全屏
  const enterFullscreen = () => {
    const element = document.body;
    console.log(element);

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }

    setFullScreen(true);
  };

  // 退出全屏
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setFullScreen(false);
  };

  // 切换全屏状态
  const toggleFullscreen = () => {
    if (isFullScreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  return (
    <div className="flex h-full justify-center w-full items-center relative">
      <div className="-translate-x-48 -translate-y-24">
        <h1
          className="text-white font-bold text-[6rem] mb-16"
          onClick={() => toggleFullscreen()}
        >
          认知健康小游戏
        </h1>
        <div className="flex gap-8">
          <NavLink
            to="/game"
            className={
              'bg-[#3ED7B5] w-80 h-36 rounded-full flex items-center justify-center text-white text-[4rem]'
            }
          >
            开始游戏
          </NavLink>

          <NavLink
            to="/consult"
            className={
              'bg-[#CFCA3B] w-80 h-36 rounded-full flex items-center justify-center text-white text-[4rem]'
            }
          >
            我要咨询
          </NavLink>
        </div>
      </div>

      <img
        src={grandmaPng}
        alt=""
        className="w-[75vh] absolute right-0 bottom-0"
      />
    </div>
  );
}
