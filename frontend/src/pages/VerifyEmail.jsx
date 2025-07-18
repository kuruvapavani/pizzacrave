import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired verification link.");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    let isCalled = false;

    if (!token || isCalled) return;

    const verifyToken = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/verify-email?token=${token}`
        );

        setMessage("✅ Email verified successfully! Redirecting to login...");
        toast.success("Email verified successfully! Redirecting to login...");
        setShowResend(false);
        localStorage.removeItem("unverifiedEmail");

        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 3000);
      } catch (err) {
        const backendError =
          err?.response?.data?.message ||
          "❌ Verification failed or link is invalid.";
        setMessage(backendError);
        toast.error(backendError);
        setShowResend(true);
        setLoading(false);
      }
    };

    if (!isCalled) {
      verifyToken();
      isCalled = true;
    }
  }, [token, navigate]);

  const handleResend = async () => {
    const email = localStorage.getItem("unverifiedEmail");
    if (!email) {
      setResendStatus("❌ Email not found. Please register again.");
      toast.error("Email not found. Please register again.");
      return;
    }

    setResendStatus("");
    setResendLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/resend-verification`,
        { email }
      );
      setResendStatus("✅ Verification email resent. Check your inbox.");
      toast.success("Verification email resent. Check your inbox.");
    } catch (err) {
      setResendStatus("❌ Failed to resend verification email.");
      toast.error("Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h2 className="text-2xl text-hero mb-4">Email Verification</h2>

      {loading ? (
        <div className="flex flex-col items-center space-y-2">
          <Leapfrog size="60" speed="2.5" color="#FFA527" />
          <p className="text-blue-600">Verifying email...</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-center">{message}</p>

          {showResend && (
            <>
              <button
                onClick={handleResend}
                className="px-4 py-2 bg-hero text-white rounded disabled:opacity-50"
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <Leapfrog size="20" speed="2.5" color="#FFFFFF" />
                ) : (
                  "Resend Verification Email"
                )}
              </button>
              {resendStatus && (
                <p className="mt-2 text-sm text-gray-700">{resendStatus}</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
