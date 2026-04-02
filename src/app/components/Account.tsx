import { useEffect, useMemo, useState } from "react";
import { Mail, PencilLine, Save, ShieldCheck, UserCircle2, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Account() {
  const { userProfile, updateUserProfile, changePassword, viewMode } = useApp();

  const profileDefaults = useMemo(
    () => ({
      fullName: userProfile?.fullName ?? "",
      email: userProfile?.email ?? "",
      phone: userProfile?.phone ?? "",
      birthDate: userProfile?.birthDate ?? "",
      gender: userProfile?.gender ?? "",
    }),
    [userProfile]
  );

  const [profileForm, setProfileForm] = useState(profileDefaults);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isDesktop = viewMode === "desktop";

  useEffect(() => {
    setProfileForm(profileDefaults);
  }, [profileDefaults]);

  const formatGender = (value: string) => {
    if (value === "male") return "Male";
    if (value === "female") return "Female";
    if (value === "other") return "Other";
    return "Not set";
  };

  const handleProfileSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateUserProfile(profileForm);
    setProfileMessage("Profile updated successfully.");
    setIsEditProfileOpen(false);
    window.setTimeout(() => setProfileMessage(""), 2400);
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      setPasswordMessage("");
      return;
    }

    const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword);

    if (!result.success) {
      setPasswordError(result.message);
      setPasswordMessage("");
      return;
    }

    setPasswordError("");
    setPasswordMessage(result.message);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangePasswordOpen(false);
    window.setTimeout(() => setPasswordMessage(""), 2400);
  };

  const displayedProfile = {
    fullName: userProfile?.fullName || "John Anderson",
    email: userProfile?.email || "john.anderson@example.com",
    phone: userProfile?.phone || "0912345678",
    birthDate: userProfile?.birthDate || "2000-01-01",
    gender: userProfile?.gender || "other",
  };

  return (
    <div className={`min-h-full ${isDesktop ? "px-8 pt-8 pb-10" : "px-5 pt-8 pb-8"}`}>
      <div className="mb-8">
        <h1 className={`font-semibold text-gray-900 mb-1 ${isDesktop ? "text-4xl" : "text-3xl"}`}>Account</h1>
        <p className="text-gray-500">View your profile details and manage account security.</p>
      </div>

      <div className={`grid gap-6 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>

          <div className="space-y-4">
            <InfoRow label="Full name" value={displayedProfile.fullName} />
            <InfoRow label="Email" value={displayedProfile.email} />
            <InfoRow label="Phone number" value={displayedProfile.phone} />
            <InfoRow label="Date of birth" value={displayedProfile.birthDate} />
            <InfoRow label="Gender" value={formatGender(displayedProfile.gender)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-white font-medium hover:bg-emerald-800 transition-colors"
            >
              <PencilLine className="w-4 h-4" />
              Update profile
            </button>
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Change password
            </button>
          </div>

          {profileMessage && <p className="text-sm text-emerald-700 mt-4">{profileMessage}</p>}
          {passwordMessage && <p className="text-sm text-emerald-700 mt-2">{passwordMessage}</p>}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 mb-1">Password status</p>
              <p>Your password can be changed anytime from this page.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900 mb-1">Primary contact</p>
              <p>{displayedProfile.email}</p>
              <p className="text-gray-500 mt-1">Phone: {displayedProfile.phone}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800 mb-1">Security tip</p>
              <p className="text-amber-900">Use a password with at least 8 characters and mix letters, numbers, and symbols.</p>
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600 mt-4">{passwordError}</p>}
        </section>
      </div>

      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`w-full rounded-2xl bg-white shadow-xl ${isDesktop ? "max-w-2xl p-6" : "max-w-md p-5"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Update Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <input
                id="fullName"
                type="text"
                value={profileForm.fullName}
                onChange={(event) =>
                  setProfileForm((previous) => ({ ...previous, fullName: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm((previous) => ({ ...previous, email: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <FieldLabel htmlFor="phone">Phone number</FieldLabel>
              <input
                id="phone"
                type="tel"
                value={profileForm.phone}
                onChange={(event) =>
                  setProfileForm((previous) => ({ ...previous, phone: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              <div className={`grid gap-4 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <FieldLabel htmlFor="birthDate">Date of birth</FieldLabel>
                  <input
                    id="birthDate"
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(event) =>
                      setProfileForm((previous) => ({ ...previous, birthDate: event.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <select
                    id="gender"
                    value={profileForm.gender}
                    onChange={(event) =>
                      setProfileForm((previous) => ({ ...previous, gender: event.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-white font-medium hover:bg-emerald-800 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`w-full rounded-2xl bg-white shadow-xl ${isDesktop ? "max-w-lg p-6" : "max-w-md p-5"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordError("");
                }}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({ ...previous, currentPassword: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({ ...previous, newPassword: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({ ...previous, confirmPassword: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Update password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordError("");
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 px-4 py-3 bg-gray-50/60">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value || "Not set"}</p>
    </div>
  );
}
