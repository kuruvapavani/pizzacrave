import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [isValidToken, setIsValidToken] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      setInitialLoading(true);
      try {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/verify-reset-token/${token}`);
        setIsValidToken(true);
      } catch (err) {
        toast.error("Invalid or expired reset link.");
      } finally {
        setInitialLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    if (newPassword !== confirmPassword) {
      setSubmitLoading(false);
      return toast.error("Passwords do not match");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setSubmitLoading(false);
      return toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/reset-password/${token}`,
        { newPassword }
      );
      toast.success(res.data.message);
      localStorage.clear();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Leapfrog
          size="60"
          speed="2.5"
          color="#FFA527"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center text-hero">
          Reset Password
        </h2>

        {!isValidToken ? (
          <p className="text-red-600 text-center"></p>
        ) : (
          <>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full border border-hero border-2 rounded-xl py-2 px-6 pr-12 outline-none text-gray-600"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={submitLoading}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-hero cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword1 ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border border-hero border-2 rounded-xl py-2 px-6 pr-12 outline-none text-gray-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={submitLoading}
              />
              <FontAwesomeIcon
                icon={showPassword1 ? faEyeSlash : faEye}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-hero cursor-pointer"
                onClick={() => setShowPassword1((prev) => !prev)}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="py-2 px-6 bg-hero text-white rounded-xl mt-6 hover:bg-opacity-90 disabled:opacity-50"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <Leapfrog
                    size="20"
                    speed="2.5"
                    color="#FFFFFF"
                  />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;