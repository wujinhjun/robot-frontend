import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  useRoutes,
  useLocation
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import {  } from 'react-router-dom';

import HomePage from '@/pages/homePage';
import ConfigPage from '@/pages/configPage';
import ChatPage from '@/pages/chatPage';
import ErrorPage from '@/pages/errorPage';
import RootComponent from './pages/root';
import MainPage from './pages/mainPage';
import StartPage from './pages/startPage';
import ConsultPage from './pages/consultPage';
import GamePage from './pages/gamePage';
import WakeUpPage from './pages/games/wakeUpPage';

import style from './styles/mainpage.module.css';

function App() {
  const routes = useRoutes([
    { path: '/', element: <StartPage /> },
    { path: '/config', element: <ConfigPage /> },
    { path: '/chat', element: <ChatPage /> },
    { path: '/consult', element: <ConsultPage /> },
    {
      path: '/game',
      element: <GamePage />
    },
    {
      path: '/game/wake-up',
      element: <WakeUpPage />
    }
  ]);

  return (
    <>
      {/* <section className={`${style['container']}`}>
        <div className={`${style['decorate-circle']}`} />
        <section className="z-[2] h-full"></section>
      </section> */}
      <Toaster />
      {/* <RouterProvider router={router} /> */}

      <section className={`${style['content-container']}`}>
        <div className={`${style['content-left-panel']}`}>
          <div className={`${style['content-decorate-circle']}`}></div>
        </div>
        {routes}

        <NavLink
          to="/"
          className={'w-fit row-start-1 row-end-2 col-start-1 col-end-2 z-[3]'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="61"
            height="89"
            viewBox="0 0 61 89"
            fill="none"
            className="ml-16 mt-16"
          >
            <path
              d="M44.3636 0L0 44.3636L44.3636 88.7273L61 72.0909L33.2727 44.3636L61 16.6364L44.3636 0Z"
              fill="white"
            />
          </svg>
        </NavLink>
      </section>
    </>
  );
}

export default App;
