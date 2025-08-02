import  axios  from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Logout = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:3001/logout", {}, {
          withCredentials:true,
        });

        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
