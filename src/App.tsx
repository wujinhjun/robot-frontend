import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from '@/pages/homePage';
import ConfigPage from '@/pages/configPage';
import ChatPage from '@/pages/chatPage';
import ErrorPage from '@/pages/errorPage';
import RootComponent from './pages/root';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      //   Component() {
      //     return (
      //       <>
      //         <HomePage />
      //       </>
      //     );
      //   },
      element: <HomePage />,
      errorElement: <ErrorPage />
    },
    {
      path: '/config',
      Component() {
        return (
          <>
            <ConfigPage />
          </>
        );
      }
    },
    {
      path: 'chat',
      Component() {
        return (
          <>
            <ChatPage />
          </>
        );
      }
    }
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
