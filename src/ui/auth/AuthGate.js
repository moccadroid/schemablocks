import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export default function AuthGate({ gateCondition, user, children }) {
  const location = useLocation();

  useEffect(() => {
    gateCondition(user);
  }, [location]);

  return children;
}