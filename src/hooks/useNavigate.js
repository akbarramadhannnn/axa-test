import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useGoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    handleGoBack,
  };
};

export default useGoBack;
