import { useState, useEffect } from 'react';
import './UserProfile.css';

function UserProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    household: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
    } else {
      // Start editing
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
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
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="household">Household</label>
            <input
              type="text"
              id="household"
              name="household"
              value={editedProfile.household}
              onChange={handleChange}
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" onClick={handleEditToggle} className="cancel-button">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{profile.name}</span>
          </div>
          
          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{profile.email}</span>
          </div>
          
          <div className="profile-item">
            <span className="profile-label">Role:</span>
            <span className="profile-value">{profile.role}</span>
          </div>
          
          <div className="profile-item">
            <span className="profile-label">Household:</span>
            <span className="profile-value">{profile.household}</span>
          </div>
          
          <button onClick={handleEditToggle} className="edit-button">Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
