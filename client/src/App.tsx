import axios from "axios";
import { Toaster } from "react-hot-toast";
import React, { Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { server } from "@/constants/config";
import Loader from "@/components/common/Loader";
import { useAppDispatch } from "@/hooks/redux.hooks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { userExists, userNotExists } from "@/redux/reducers/auth";


const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Register = React.lazy(() => import("./pages/Register"));
const NotFound = React.lazy(() => import("./pages/NotFound"));


const router = createBrowserRouter(
  [
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/chat/:chatId",
      element: (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);


const App = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(`${server}/user/profile`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
   }, [dispatch]);

  
  return (
    <div className="p-4 h-screen flex items-center justify-center -mt-2">
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="bottom-center" />
    </div>
  );
};


export default App;