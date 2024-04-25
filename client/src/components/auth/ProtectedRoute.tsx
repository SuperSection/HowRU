import { useAppSelector } from "@/hooks/redux.hooks";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const redirectUrl = "/login";

  useEffect(() => {
    if (user === null) {
      navigate(redirectUrl, { replace: true });
    }
  }, [navigate, redirectUrl, user])


  return children;
}
