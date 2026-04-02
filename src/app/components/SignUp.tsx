import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, BookOpen, User, Phone, CalendarDays } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { register, viewMode } = useApp();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{9,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!isPhoneVerified) {
      newErrors.phoneVerified = "Please verify your phone number";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      register(
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
        },
        formData.password
      );
      setIsLoading(false);
      navigate("/app");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "phone") {
      setIsPhoneVerified(false);
      setErrors(prev => ({ ...prev, phoneVerified: "" }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleVerifyPhone = () => {
    const normalizedPhone = formData.phone.replace(/\D/g, "");

    if (!normalizedPhone) {
      setErrors(prev => ({ ...prev, phone: "Phone number is required", phoneVerified: "" }));
      setIsPhoneVerified(false);
      return;
    }

    if (!/^\d{9,15}$/.test(normalizedPhone)) {
      setErrors(prev => ({ ...prev, phone: "Phone number is invalid", phoneVerified: "" }));
      setIsPhoneVerified(false);
      return;
    }

    setIsPhoneVerified(true);
    setErrors(prev => ({ ...prev, phone: "", phoneVerified: "" }));
  };

  const isDesktop = viewMode === "desktop";

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-lime-50 to-green-100 ${isDesktop ? 'p-8' : 'p-5'}`}>
      <div className={`w-full ${isDesktop ? 'max-w-md' : 'max-w-sm'}`}>
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className={`font-bold text-gray-900 mb-2 ${isDesktop ? 'text-3xl' : 'text-2xl'}`}>
            Study Planner
          </h1>
          <p className="text-gray-500">Energy-based learning</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className={`font-semibold text-gray-900 mb-2 ${isDesktop ? 'text-2xl' : 'text-xl'}`}>
            Create account
          </h2>
          <p className="text-gray-500 mb-6">Start your learning journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0912345678"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  className={`px-4 py-3.5 rounded-xl font-semibold border transition-colors whitespace-nowrap ${
                    isPhoneVerified
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {isPhoneVerified ? "Verified" : "Verify"}
                </button>
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
              )}
              {!errors.phone && errors.phoneVerified && (
                <p className="mt-1.5 text-sm text-red-600">{errors.phoneVerified}</p>
              )}
              {isPhoneVerified && (
                <p className="mt-1.5 text-sm text-emerald-700">Phone number verified</p>
              )}
            </div>

            {/* Date of Birth Input */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.birthDate && (
                <p className="mt-1.5 text-sm text-red-600">{errors.birthDate}</p>
              )}
            </div>

            {/* Gender Input */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`block w-full px-4 py-3.5 border rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1.5 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <button type="button" className="text-emerald-700 hover:text-emerald-800 font-medium">
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button type="button" className="text-emerald-700 hover:text-emerald-800 font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-all text-base shadow-lg shadow-emerald-700/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          By creating an account, you agree to our{" "}
          <button className="text-emerald-700 hover:text-emerald-800">Terms</button> and{" "}
          <button className="text-emerald-700 hover:text-emerald-800">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
