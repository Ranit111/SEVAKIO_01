"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, updatePassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const [showPasswordSetupModal, setShowPasswordSetupModal] = useState(false);
  const [passwordSetupData, setPasswordSetupData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSetupLoading, setPasswordSetupLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Email already registered. Please login.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters with a mix of letters and numbers.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/invalid-credential":
        return "Invalid email or password format.";
      case "auth/operation-not-allowed":
        return "Sign up is currently disabled. Please try again later.";
      default:
        return "An error occurred during sign up. Please try again.";
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods && signInMethods.length > 0;
    } catch (error) {
      // If error is "auth/invalid-email", email is invalid but not registered
      if (error.code === "auth/invalid-email") {
        return false;
      }
      // For other errors, assume email doesn't exist to allow signup
      return false;
    }
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      setShowError(true);
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setShowError(true);
      return false;
    }

    // Check phone
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      setShowError(true);
      return false;
    }

    // Check password strength
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setShowError(true);
      return false;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setShowError(true);
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setShowError(false);
    setShouldRedirectToLogin(false);

    // Check email format only
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setShowError(true);
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists - check email only, not password
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrorMessage("Email already registered. Please login.");
        setShowError(true);
        setShouldRedirectToLogin(true);
        setIsLoading(false);
        return;
      }

      // Validate other fields (not password check)
      if (!formData.fullName.trim()) {
        setErrorMessage("Please enter your full name.");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      if (!formData.phone.trim()) {
        setErrorMessage("Please enter your phone number.");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match. Please try again.");
        setShowError(true);
        setIsLoading(false);
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with full name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      // Send user data to backend (include Firebase ID token)
      try {
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          throw new Error('Failed to get Firebase ID token');
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const resp = await fetch(`${apiUrl}/api/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            fullName: formData.fullName,
            phoneNumber: formData.phone,
          }),
        });

        console.log(`Backend response: ${resp.status}`);

        if (resp.status === 201) {
          router.push('/');
        } else if (resp.status === 409) {
          setErrorMessage('The email is already registered, please login');
          setShowError(true);
          setShouldRedirectToLogin(true);
          setIsLoading(false);
          return;
        } else if (resp.status === 401) {
          setErrorMessage('Authentication failed. Please login again.');
          setShowError(true);
          setShouldRedirectToLogin(true);
          setIsLoading(false);
          try { await auth.signOut(); } catch (e) { /* ignore */ }
          return;
        } else if (resp.status === 500) {
          console.error('Backend server error');
          setErrorMessage('Server error. Please try again later.');
          setShowError(true);
          setIsLoading(false);
          return;
        } else {
          const data = await resp.json().catch(() => ({}));
          console.error(`Backend error (${resp.status}):`, data);
          setErrorMessage(data.error || 'Failed to save user to backend');
          setShowError(true);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to call backend:', err);
        setErrorMessage('Failed to save user to backend');
        setShowError(true);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      // Handle email already in use
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already registered. Please login.");
        setShowError(true);
        setShouldRedirectToLogin(true);
      } else {
        const errorMsg = getErrorMessage(error.code);
        setErrorMessage(errorMsg);
        setShowError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage("");
    setShowError(false);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check what sign-in methods already exist for this email
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
      
      // Determine if this is a NEW or EXISTING user
      // NEW user: no prior sign-in methods found (brand new email)
      // EXISTING user: email already has one or more sign-in methods
      const isNewUser = signInMethods.length === 0;
      
      if (isNewUser) {
        // New Google signup - create user in backend then ask user to set password
        try {
          const idToken = await user.getIdToken();
          if (!idToken) {
            throw new Error('Failed to get Firebase ID token');
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
          const resp = await fetch(`${apiUrl}/api/users/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || '',
              phoneNumber: '',
            }),
          });

          console.log(`Backend response: ${resp.status}`);

          if (resp.status === 201) {
            setShowPasswordSetupModal(true);
          } else if (resp.status === 409) {
            setErrorMessage('The email is already registered, please login');
            setShowError(true);
            setShouldRedirectToLogin(true);
            try {
              await auth.signOut();
            } catch (signOutError) {
              console.error('Sign out error:', signOutError);
            }
          } else if (resp.status === 401) {
            setErrorMessage('Authentication failed. Please login again.');
            setShowError(true);
            setShouldRedirectToLogin(true);
            try { await auth.signOut(); } catch (e) { /* ignore */ }
          } else if (resp.status === 500) {
            console.error('Backend server error');
            setErrorMessage('Server error. Please try again later.');
            setShowError(true);
          } else {
            const data = await resp.json().catch(() => ({}));
            console.error(`Backend error (${resp.status}):`, data);
            setErrorMessage(data.error || 'Failed to save user to backend');
            setShowError(true);
          }
        } catch (err) {
          console.error('Failed to call backend:', err);
          setErrorMessage('Failed to save user to backend');
          setShowError(true);
        }
      } else {
        // Email already registered - don't show password setup
        setErrorMessage("The email is already registered, please login");
        setShowError(true);
        setShouldRedirectToLogin(true);
        // Sign out since this is a duplicate signup attempt
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error("Sign out error:", signOutError);
        }
      }
    } catch (error) {
      let errorMsg = "An error occurred during Google sign up. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMsg = "Sign up was cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMsg = "Pop-up was blocked. Please allow popups and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMsg = "Sign up was cancelled. Please try again.";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        errorMsg = "This email is already registered with a different sign-in method. Please login instead.";
      }

      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setPasswordSetupLoading(true);

    try {
      // Validate passwords
      if (passwordSetupData.newPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        setShowError(true);
        setPasswordSetupLoading(false);
        return;
      }

      if (passwordSetupData.newPassword !== passwordSetupData.confirmPassword) {
        setErrorMessage("Passwords do not match. Please try again.");
        setShowError(true);
        setPasswordSetupLoading(false);
        return;
      }

      // Update password for current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updatePassword(currentUser, passwordSetupData.newPassword);
        
        // Show success message
        setShowPasswordSetupModal(false);
        setErrorMessage("Password set successfully! Redirecting...");
        setShowError(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          setShowError(false);
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      let errorMsg = "Failed to set password. Please try again.";
      
      if (error.code === "auth/weak-password") {
        errorMsg = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMsg = "Please log in again to update your password.";
      }

      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setPasswordSetupLoading(false);
    }
  };

  return (
    <>
      <Header />
      {showPasswordSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Set Your Password</h2>
            <p className="text-gray-600 text-sm mb-6">
              Create a password to secure your account and enable email login.
            </p>
            <form onSubmit={handlePasswordSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordSetupData.newPassword}
                  onChange={(e) =>
                    setPasswordSetupData({
                      ...passwordSetupData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordSetupData.confirmPassword}
                  onChange={(e) =>
                    setPasswordSetupData({
                      ...passwordSetupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordSetupLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition mt-6 flex items-center justify-center"
              >
                {passwordSetupLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting Password...
                  </>
                ) : (
                  "Set Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {errorMessage === "Password set successfully! Redirecting..."
                  ? "Successfully Registered"
                  : shouldRedirectToLogin
                  ? "Already Registered"
                  : "Signup Error"}
              </h2>
              <button
                onClick={() => {
                  setShowError(false);
                  if (shouldRedirectToLogin) {
                    router.push("/login");
                  }
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-700 mb-6 text-sm">
              {errorMessage}
            </p>
            <button
              onClick={() => {
                setShowError(false);
                if (shouldRedirectToLogin) {
                  router.push("/login");
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition"
            >
              Try Again
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
            Sign Up
          </h1>
          <p className="text-gray-600 text-center mb-6 text-xs">
            Create your account to get started
          </p>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
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

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 border-2 border-gray-300 rounded focus:border-blue-600 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the{" "}
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition mt-6 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-600 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold py-2.5 rounded-lg transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">Sign Up with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8 text-sm">
            Already have an account?{" "}
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
