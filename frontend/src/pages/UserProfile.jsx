import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPenToSquare,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
  const id = localStorage.getItem('id');
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading...");
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // Form state
  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Toggle visibility
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Feedback messages
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);
  const userToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/my-profile`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUsername(res.data.username);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userToken]);

  useEffect(() => {
      const checkRole = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/get-role/${id}`);
          if (res.data.role === "admin") {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Failed to fetch role:", err);
          navigate("/");
        }
      };
  
      checkRole();
    }, [id, navigate]);

  const handleUsernameUpdate = async () => {
    setUsernameError("");
    setUsernameSuccess("");

    if (!newUsername || !usernamePassword) {
      setUsernameError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/users/update-username`,
        {
          newUsername,
          password: usernamePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setUsername(res.data.username);
      setUsernameSuccess("Username updated successfully");
      setNewUsername("");
      setUsernamePassword("");

      setTimeout(() => {
        setUsernameModalOpen(false);
        setUsernameSuccess("");
      }, 1000);
    } catch (err) {
      setUsernameError(err.response?.data?.message || "Failed to update username");
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      // eslint-disable-next-line
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/users/change-password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 1000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center mt-10 px-4">
        {/* Profile Icon */}
        <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-hero mb-6">
          <FontAwesomeIcon icon={faUser} className="text-hero w-16 h-16" />
        </div>

        {/* Username Display */}
        <div className="flex items-center gap-2 text-lg font-medium mb-6">
          <span>{username}</span>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-hero cursor-pointer"
            onClick={() => setUsernameModalOpen(true)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="bg-hero text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Edit Password
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="border border-hero text-hero px-4 py-2 rounded hover:bg-hero hover:text-white transition"
          >
            View My Orders
          </button>
          {isAdmin && (
            <button
            onClick={() => navigate("/admin/dashboard")}
            className="border border-hero text-hero px-4 py-2 rounded hover:bg-hero hover:text-white transition"
          >
            Go to Dashboard
          </button>
          )}
        </div>
      </div>

      {/* Username Modal */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl text-hero mb-4">Update Username</h2>

            {usernameError && <p className="text-red-500 mb-4">{usernameError}</p>}
            {usernameSuccess && (
              <p className="text-green-600 mb-4">{usernameSuccess}</p>
            )}

            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-hero"
            />

            <div className="relative mb-4">
              <input
                type={showUsernamePassword ? "text" : "password"}
                placeholder="Current Password"
                value={usernamePassword}
                onChange={(e) => setUsernamePassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-hero"
              />
              <FontAwesomeIcon
                icon={showUsernamePassword ? faEyeSlash : faEye}
                onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUsernameModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameUpdate}
                className="bg-hero text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl text-hero mb-4">Change Password</h2>

            {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
            {passwordSuccess && (
              <p className="text-green-600 mb-4">{passwordSuccess}</p>
            )}

            {/* Current Password */}
            <div className="relative mb-4">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-hero"
              />
              <FontAwesomeIcon
                icon={showCurrentPassword ? faEyeSlash : faEye}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              />
            </div>

            {/* New Password */}
            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-hero"
              />
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              />
            </div>

            {/* Confirm New Password */}
            <div className="relative mb-4">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-hero"
              />
              <FontAwesomeIcon
                icon={showConfirmNewPassword ? faEyeSlash : faEye}
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="bg-hero text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;
