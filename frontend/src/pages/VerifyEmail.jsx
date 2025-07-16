import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const token = searchParams.get("token");
  const navigate = useNavigate();

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
      return;
    }

    setResendStatus("Sending...");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/resend-verification`,
        { email }
      );
      setResendStatus("✅ Verification email resent. Check your inbox.");
    } catch (err) {
      setResendStatus("❌ Failed to resend verification email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h2 className="text-2xl text-hero mb-4">Email Verification</h2>

      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full" />
          <p className="text-blue-600">Verifying email...</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-center">{message}</p>

          {showResend && (
            <>
              <button
                onClick={handleResend}
                className="px-4 py-2 bg-hero text-white rounded"
              >
                Resend Verification Email
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
