import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaRegUserCircle, FaEyeSlash, FaEye } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { useConversation } from "../../context";
import { IoMenu } from "react-icons/io5";

import "./style.css";
import "../styles/responsive.css";
const Header = () => {
  const {
    language,
    setLanguage,
    setReset,
    displayTip,
    setDisplayTip,
    setDisplayBurger,
    displayBurger,
  } = useConversation();
  return (
    <header className="main-header">
      <div className="logo">
        <img src="logo.gif" alt="app_logo" />
      </div>
      <input
        type="checkbox"
        id="burger"
        style={{ opacity: "0" }}
        onClick={() => setDisplayBurger(!displayBurger)}
      />
      <label htmlFor="burger">
        <IoMenu
          className="burger"
          style={{ color: displayBurger ? "rgb(118, 103, 237)" : "grey" }}
        />
      </label>

      <nav className="nav">
        <input
          type="checkbox"
          id="eye"
          style={{ opacity: "0" }}
          onClick={() => setDisplayTip(!displayTip)}
        />
        <label htmlFor="eye">
          {displayTip ? (
            <FaEye className="eye" />
          ) : (
            <FaEyeSlash className="eye" />
          )}
        </label>
        <div className="profile-div">
          <FaRegUserCircle className="user profile" />
          <ul className="user-data">
            <li className="triangle"></li>
            <li>Login</li>
            <li>Sign Up</li>
          </ul>
        </div>

        <div className="languages">
          <IoGlobeOutline className="user" />
          <select
            name="languages"
            value={language}
            id=""
            onChange={(event) => {
              setLanguage(event.target.value);
              setReset(true);
            }}
          >
            <option
              value="en"
              style={{ display: language === "en" ? "none" : "block" }}
            >
              English
            </option>
            <option
              value="hi"
              style={{ display: language === "hi" ? "none" : "block" }}
            >
              Hindi
            </option>
            <option
              value="te"
              style={{ display: language === "te" ? "none" : "block" }}
            >
              Telugu
            </option>
            <option
              value="ta"
              style={{ display: language === "ta" ? "none" : "block" }}
            >
              Tamil
            </option>
          </select>
        </div>
      </nav>
      <nav
        className="nav-mobile"
        style={{ display: displayBurger ? "flex" : "none" }}
      >
        <input
          type="checkbox"
          id="eye"
          style={{ opacity: "0" }}
          onClick={() => setDisplayTip(!displayTip)}
        />
        <label htmlFor="eye">
          {displayTip ? (
            <FaEye className="eye" />
          ) : (
            <FaEyeSlash className="eye" />
          )}
        </label>
        <div className="profile-div">
          <FaRegUserCircle className="user profile" />
          <ul className="user-data">
            <li className="triangle"></li>
            <li>Login</li>
            <li>Sign Up</li>
          </ul>
        </div>

        <div className="languages">
          <IoGlobeOutline className="user" />
          <select
            name="languages"
            value={language}
            id=""
            onChange={(event) => {
              setLanguage(event.target.value);
              setReset(true);
            }}
          >
            <option
              value="en"
              style={{ display: language === "en" ? "none" : "block" }}
            >
              English
            </option>
            <option
              value="hi"
              style={{ display: language === "hi" ? "none" : "block" }}
            >
              Hindi
            </option>
            <option
              value="te"
              style={{ display: language === "te" ? "none" : "block" }}
            >
              Telugu
            </option>
            <option
              value="ta"
              style={{ display: language === "ta" ? "none" : "block" }}
            >
              Tamil
            </option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;
