import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@/pages/homePage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component() {
        return (
          <>
            <HomePage />
          </>
        );
      }
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
