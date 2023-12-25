import { NavLink } from 'react-router-dom';

import grandmaPng from '@/assets/free-icon-grandmother-375303.png';

export default function GamePage() {
  return (
    <>
      <div className="row-start-1 row-end-2 col-start-1 col-end-2 z-[2] self-center justify-items-center justify-self-center">
        <h1 className="text-white font-bold text-[6rem] mb-16">
          认知健康小游戏
        </h1>
        <div className="flex gap-8 flex-wrap w-[670px] justify-center">
          <NavLink
            to="/game/wake-up"
            className={
              'bg-[#3ED7B5] w-60 h-24 rounded-full flex items-center justify-center text-white text-[3rem]'
            }
          >
            唤醒操
          </NavLink>

          <NavLink
            to="/"
            className={
              'bg-[#CFCA3B] w-60 h-24 rounded-full flex items-center justify-center text-white text-[3rem]'
            }
          >
            记忆卡片
          </NavLink>

          <NavLink
            to="/"
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
        className=" row-start-1 row-end-2 col-start-2 col-end-3 self-end z-[3] origin-bottom-right scale-150"
      />
    </>
  );
}
