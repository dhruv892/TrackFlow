import React, { useState } from "react";

import logo from "../assets/logo.svg";
import Search from "./Search";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { updateUser } from "../api/userApi";
import { useAuthStore } from "../store/auth";

export default function Nav() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const handleUpdateProfile = async (
    user: Partial<{ name: string; email: string }>
  ) => {
    await updateUser(user);
    // read current user from the store and pass a concrete object to setUser
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    setUser({
      ...currentUser,
      ...user,
    });
  };

  return (
    <>
      <div className="flex pb-2 pl-2 pr-2 justify-between border-b-2 border-gray-700 content-cente items-center">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" width={50} height={50} />
          </Link>
        </div>
        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-2/3">
            <Search />
          </div>

          <button>
            <Plus className="hover:text-white text-gray-500" />
          </button>
        </div>
        <div>
          <div
            className="cursor-pointer"
            onClick={() => setShowProfileModal(true)}
          >
            <User className="hover:text-white text-gray-500" />
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onAdd={handleUpdateProfile}
        />
      )}
    </>
  );
}
