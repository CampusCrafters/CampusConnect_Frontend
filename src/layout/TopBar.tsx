import { useNavigate } from "react-router-dom";
import SearchIcon from "../assets/icons/magnifying-glass.svg";
import BellIcon from "../assets/icons/ph_bell.svg";
import BackIcon from "../assets/icons/backicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProfile } from "../redux/users/profileActions";
import { RootState } from "../redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { setSearchQuery } from "@/redux/searchSlice";
import ProfileIcon from "../components/custom-ui/profile-icon";
import defaultProfilePicture from "../assets/icons/Default_pfp.svg.png";

const TopBar = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const [clicked, setClicked] = useState(false);
  const location = useLocation();
  const showSearchIcon = [
    "/explore-all",
    "/test",
    "/myApplications",
    "/events",
    "/chat",
  ].includes(location.pathname);

  const showBackIcon = location.pathname.includes("/manageproject");

  const activeTab = location.pathname.split("/")[1];
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    Cookies.remove("jwt", { path: "/" });
    dispatch({ type: "CLEAR_USER_STATE" });
    window.location.href = "/";
  };

  const handleSearch = (e: any) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <nav className="fixed mt-[23px] h-[55px] w-full bg-black text-white flex items-center justify-between px-[24px]">
      <div
        className={`flex items-center justify-between transition-all duration-300 ${
          clicked ? "w-0 opacity-0" : "w-full opacity-100"
        }`}
      >
        <div className="flex gap-4">
          {showBackIcon && (
            <img
              src={BackIcon}
              className="cursor-pointer"
              onClick={() => navigate("/my-listings")}
            />
          )}
          <div style={headingStyles}>{activeTab}</div>
        </div>
        <div className="flex gap-[16px] items-center">
          {showSearchIcon && (
            <img
              src={SearchIcon}
              className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
              onClick={() => setClicked(true)}
            />
          )}
          <img
            src={BellIcon}
            className="cursor-pointer h-[24px] w-[24px] transform hover:scale-110 transition-transform duration-200"
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              {profile && profile.profile_picture ? (
                <ProfileIcon src={profile.profile_picture} size={"large"} />
              ) : (
                <ProfileIcon src={defaultProfilePicture} size={"large"} />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={`flex gap-2 items-center transition-all duration-300 ${
          clicked ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      >
        <img
          src={BackIcon}
          className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
          onClick={() => setClicked(false)}
        />
        <input
          onChange={handleSearch}
          placeholder="Search for projects, internships, events......"
          type="text"
          className="w-full bg-[#262626] text-white px-3 py-2 rounded-lg border border-gray-600 transition-all duration-300 ease-in-out focus:outline-none focus:border-blue-500"
        />
      </div>
    </nav>
  );
};

export default TopBar;

const headingStyles: React.CSSProperties = {
  cursor: "pointer",
  color: "#2979FF",
  fontFamily: "Raleway",
  fontSize: "1.6rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
};
