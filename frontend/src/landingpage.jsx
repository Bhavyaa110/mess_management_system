import React from "react";
import "./landingpage.css";
import { Home, User, Bell, Settings } from "lucide-react";
import Logo from "./assets/Logo.png";
import Wallet from "./assets/Wallet.png"
import Meals from "./assets/Meals.svg"
import Ticket from "./assets/Ticket.png"

const LandingPage = () => {
  const SidebarIcon = ({ icon }) => <div className="icon-button">{icon}</div>;

  return (
    <div className="page">
      <div className="leftpart">
        <div className="sidebar">
          <div className="logo">
            
          </div>
          <div className="icons">
            <img className="IMG" alt="Img" src={Logo} />
            <SidebarIcon icon={<Home />} />
            <SidebarIcon icon={<User />} />
            <SidebarIcon icon={<Bell />} />
            <SidebarIcon icon={<Settings />} />
          </div>
        </div>
      </div>
      <div className="rightpart">
        <div className="toppart">
          <div className="navbar">
            <div className="navbar-left">Welcome to MEXX</div>
            <div className="navbar-right">
              <Bell className="nav-icon" />
              <User className="nav-icon" />
            </div>
          </div>
        </div>
        <div className="bottompart">
          <div className="part1"></div>
          <div className="part2">
            <div className="part2up">
              <div className="box1">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Wallet} />
                </div>
                Wallet
              </div>
              <div className="box2">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Meals} />
                </div>
                Meals
              </div>
              <div className="box3">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Ticket} />
                </div>
                Tickets
              </div>
            </div>
            <div className="part2down">
              <div className="menu">Menu for the week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
