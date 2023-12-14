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
    }
  ]);

  return (
    <>
      <section className={`${style['container']}`}>
        <div className={`${style['decorate-circle']}`} />
        <section className="z-[2] h-full">{routes}</section>
      </section>
      <Toaster />
      {/* <RouterProvider router={router} /> */}
    </>
  );
}

export default App;
