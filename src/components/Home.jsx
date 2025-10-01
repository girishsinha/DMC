import { useUser } from "@/context/userContext";
import React from "react";

const Home = () => {
  const user = useUser();
  console.log(user);
  return (
    <div>
      <h1>Home Page </h1>
    </div>
  );
};

export default Home;
