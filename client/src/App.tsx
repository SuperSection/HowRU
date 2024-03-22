import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Register = React.lazy(() => import("./pages/Register"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chat/:chatId",
      element: <Chat />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  }
);

const App = () => {
  return (
    <div className="p-4 h-screen flex items-center justify-center -mt-2">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
