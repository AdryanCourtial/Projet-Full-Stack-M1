import type React from "react";
import "./Navbar.css";
import { Link } from "react-router";
import HomeIcon from "../../../assets/home";
import ClockIcon from "../../../assets/clock";
import GroupIcon from "../../../assets/group";
import SettingIcon from "../../../assets/settings";
import BudgetIcon from "../../../assets/budget";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-glass-400">
      <Link to={"/home"}>
        <span>Menu</span>
        <HomeIcon fill="white" />
      </Link>
      <Link to={"/schedule"}>
        <span> Echéance </span>
        <ClockIcon fill="white" />
      </Link>
      <Link to={"/groupe"}>
        <span> Groupe </span>
        <GroupIcon fill="white" />
      </Link>
      <Link to={"/budget"}>
        <span> Budget </span>
        <BudgetIcon fill="white" />
      </Link>
      <Link to={"/settings"} className="settings">
        <span> Parametre </span>
        <SettingIcon fill="white" />
      </Link>
    </nav>
  );
};

export default Navbar;
