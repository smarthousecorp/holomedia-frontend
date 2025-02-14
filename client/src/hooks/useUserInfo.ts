import { useEffect, useState } from "react";
import { User } from "../types/user";
import { api } from "../utils/api";

// Custom hook for fetching user info
export const useUserInfo = (memberNo: string) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("실행 됨", memberNo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/member?memberNo=${memberNo}`);
        const data = await response.data;
        console.log(data);

        if (data.code === 0) {
          setUserInfo(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.log(error);
        setError("Failed to fetch user information");
      } finally {
        setIsLoading(false);
      }
    };

    if (memberNo) {
      fetchUserInfo();
    }
  }, [memberNo]);

  return { userInfo, isLoading, error };
};
