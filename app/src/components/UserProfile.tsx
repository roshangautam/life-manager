import React, { useState, useEffect, JSX } from 'react';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Profile {
  name: string;
  email: string;
  role: string;
  household: string;
}

function UserProfile(): JSX.Element {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    role: '',
    household: ''
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<Profile>({} as Profile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch user profile data from API
    // For now, using mock data
    setTimeout(() => {
      setProfile({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        household: 'Doe Family'
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handleEditToggle = (): void => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
    } else {
      // Start editing
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // TODO: Connect with backend API to update profile
    console.log('Profile update submitted:', editedProfile);
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setProfile(editedProfile);
      setIsEditing(false);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card p-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <UserCircleIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white dark:border-slate-800 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">{profile.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-2">
                {profile.role}
              </span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditToggle}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="household" className="form-label">
                  Household Name
                </label>
                <input
                  type="text"
                  id="household"
                  name="household"
                  value={editedProfile.household}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleEditToggle}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</span>
                    <span className="text-slate-900 dark:text-white">{profile.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</span>
                    <span className="text-slate-900 dark:text-white">{profile.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Role</span>
                    <span className="text-slate-900 dark:text-white">{profile.role}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Household</span>
                    <span className="text-slate-900 dark:text-white">{profile.household}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckIcon className="w-5 h-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Account Active
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is active and all features are available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;