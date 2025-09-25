import React from "react";

import logo from "../assets/logo.svg";
import Search from "./common/Search";
import { Plus, User } from "lucide-react";

export default function Nav() {
  return (
    <>
      <div className="flex pb-2 justify-between border-b-2 border-gray-700 content-cente items-center">
        <div>
          <img src={logo} alt="Logo" width={50} height={50} />
        </div>
        <div className="w-full flex items-center justify-center gap-2">
          <div className="w-2/3">
            <Search />
          </div>

          <button>
            <Plus />
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
