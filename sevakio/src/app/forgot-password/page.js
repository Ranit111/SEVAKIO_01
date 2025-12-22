"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { verifyPasswordResetCode, confirmPasswordReset, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPassword() {
  const router = useRouter();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const validateForm = () => {
    if (!resetCode.trim()) {
      setErrorMessage("Please enter the verification code.");
      setShowError(true);
      return false;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setShowError(true);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setShowError(true);
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowError(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Verify the reset code
      const email = await verifyPasswordResetCode(auth, resetCode);

      // Confirm the password reset
      await confirmPasswordReset(auth, resetCode, newPassword);

      // Try to auto-login the user
      try {
        await signInWithEmailAndPassword(auth, email, newPassword);
      } catch (loginError) {
        // If auto-login fails, just show success and redirect to login
        console.error("Auto-login failed:", loginError);
      }

      // Show success message
      setErrorMessage("Password updated successfully! Redirecting...");
      setShowError(true);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      let errorMsg = "Failed to reset password. Please try again.";

      if (error.code === "auth/invalid-action-code" || error.code === "auth/expired-action-code") {
        errorMsg = "Invalid or expired code. Please request a new password reset.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/user-not-found") {
        errorMsg = "Unable to find user account.";
      }

      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {errorMessage.includes("successfully") ? "Success" : "Error"}
              </h2>
              <button
                onClick={() => setShowError(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-700 mb-6 text-sm">{errorMessage}</p>
            <button
              onClick={() => setShowError(false)}
              className={`w-full ${
                errorMessage.includes("successfully")
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold py-2.5 rounded-lg transition`}
            >
              {errorMessage.includes("successfully") ? "Continue" : "Try Again"}
            </button>
          </div>
        </div>
      )}
      <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                S
              </div>
            </div>

            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
              Reset Password
            </h1>
            <p className="text-gray-600 text-center mb-6 text-xs">
              Enter the verification code from your email
            </p>

            {/* Reset Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Verification Code Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Paste the code from your email"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.83 9L15.64 12.81c.04-.21.06-.42.06-.64 0-1.66-1.34-3-3-3-.22 0-.43.02-.64.07zM7.06 6.82c1.13-.64 2.44-.99 3.94-.99 4.97 0 9.27 3.11 11 7.5-.4 1.07-1.08 2.07-1.92 2.9l-4.2-4.2c.04-.21.06-.42.06-.64 0-1.66-1.34-3-3-3-.22 0-.43.02-.64.06l-4.24-4.24zM2 4.27l2.28 2.28l.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.83 9L15.64 12.81c.04-.21.06-.42.06-.64 0-1.66-1.34-3-3-3-.22 0-.43.02-.64.07zM7.06 6.82c1.13-.64 2.44-.99 3.94-.99 4.97 0 9.27 3.11 11 7.5-.4 1.07-1.08 2.07-1.92 2.9l-4.2-4.2c.04-.21.06-.42.06-.64 0-1.66-1.34-3-3-3-.22 0-.43.02-.64.06l-4.24-4.24zM2 4.27l2.28 2.28l.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition mt-6 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <p className="text-center text-gray-600 mt-8 text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-bold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
