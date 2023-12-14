import { NavLink } from 'react-router-dom';

import grandmaPng from '@/assets/free-icon-grandmother-375303.png';

export default function GamePage() {
  return (
    <div className="flex h-full justify-center w-full items-center relative">
      <NavLink to="/" className={'absolute top-16 left-16'}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="61"
          height="89"
          viewBox="0 0 61 89"
          fill="none"
        >
          <path
            d="M44.3636 0L0 44.3636L44.3636 88.7273L61 72.0909L33.2727 44.3636L61 16.6364L44.3636 0Z"
            fill="white"
          />
        </svg>
      </NavLink>
      <div className="-translate-x-48 ">
        <h1 className="text-white font-bold text-[6rem] mb-16">
          认知健康小游戏
        </h1>
        <div className="flex gap-8 flex-wrap w-[670px] justify-center">
          <NavLink
            to="/game"
            className={
              'bg-[#3ED7B5] w-60 h-24 rounded-full flex items-center justify-center text-white text-[3rem]'
            }
          >
            唤醒操
          </NavLink>

          <NavLink
            to="/consult"
            className={
              'bg-[#CFCA3B] w-60 h-24 rounded-full flex items-center justify-center text-white text-[3rem]'
            }
          >
            记忆卡片
          </NavLink>

          <NavLink
            to="/consult"
            className={
              'bg-[#D75A3E] w-60 h-24 rounded-full flex items-center justify-center text-white text-[3rem]'
            }
          >
            数字游戏
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
