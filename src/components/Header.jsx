import { SignIn, UserButton, useUser } from "@clerk/clerk-react";
import logo from "../assets/logo-color.svg";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="flex justify-between  items-center shadow-sm p-5">
      <Link to={"/"}>
        <img src={logo} width={150} height={100} />
      </Link>
      <ul className="flex md:flex gap-16">
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          <Link to={"/"}>Home</Link>
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          <Link to={"/search"}>Search</Link>
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          New
        </li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
          Preowned
        </li>
      </ul>

      {isSignedIn ? (
        <div className="flex items-center gap-5">
          <UserButton />
          <Link to={"/profile"}>
            <Button>Submit Listing</Button>
          </Link>
        </div>
      ) : (
        <Button>
          <SignIn />
        </Button>
      )}
    </div>
  );
}

export default Header;
