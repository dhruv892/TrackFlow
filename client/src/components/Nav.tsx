import React from "react";

import logo from "../assets/logo.svg";
import Search from "./Search";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <>
      <div className="flex pb-2 pl-2 pr-2 justify-between border-b-2 border-gray-700 content-cente items-center">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" width={50} height={50} />
          </Link>
        </div>
        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-2/3 ">
            <Search />
          </div>

          <button>
            <Plus className="hover:text-white text-gray-500" />
          </button>
        </div>
        <div>
          <div>
            <User />
          </div>
        </div>
      </div>
    </>
  );
}
