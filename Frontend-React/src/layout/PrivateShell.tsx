import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar/Navbar";

const PrivateShell: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PrivateShell;
