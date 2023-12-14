import { NavLink } from 'react-router-dom';

import grandmaPng from '@/assets/free-icon-grandmother-375303.png';

export default function StartPage() {
  return (
    <div className="flex h-full justify-center w-full items-center relative">
      <div className="-translate-x-48 -translate-y-24">
        <h1 className="text-white font-bold text-[6rem] mb-16">
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
