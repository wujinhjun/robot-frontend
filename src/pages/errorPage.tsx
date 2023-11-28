import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as {
    statusText?: string;
    message?: string;
  };

  console.error(error);

  return (
    <div className="flex flex-col w-full justify-center h-full items-center gap-8">
      <h1 className="text-[5rem] font-bold">Oops!</h1>
      <p className="text-lg">Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
