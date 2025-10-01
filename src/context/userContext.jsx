import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    status: false,
    data: {
      token: null,
      user_name: null,
      roles: null,
    },
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
