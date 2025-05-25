import React, { useState, useEffect } from 'react';
import './HouseholdMembers.css';

type MemberRole = 'admin' | 'member';
type MemberStatus = 'active' | 'pending';

interface Member {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
}

function HouseholdMembers(): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<MemberRole>('member');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setMembers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'member', status: 'pending' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'member', status: 'active' }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleInvite = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    
    // TODO: Connect with backend API
    console.log('Inviting:', email, 'as', role);
    
    // Simulate API call
    setTimeout(() => {
      setMembers([...members, {
        id: members.length + 1,
        name: 'New User',
        email,
        role,
        status: 'pending'
      }]);
      setEmail('');
      setRole('member');
    }, 500);
  };

  const handleRoleChange = (memberId: number, newRole: MemberRole): void => {
    // TODO: Connect with backend API
    console.log('Changing role for member', memberId, 'to', newRole);
    
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
  };

  const handleRemove = (memberId: number): void => {
    // TODO: Connect with backend API
    console.log('Removing member', memberId);
    
    setMembers(members.filter(member => member.id !== memberId));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading household members...</p>
      </div>
    );
  }

  return (
    <div className="household-members-container">
      <h2>Household Members</h2>
      <p className="subtitle">Manage who has access to your household</p>
      
      <div className="members-list">
        {members.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-info">
              <h4>{member.name}</h4>
              <p>{member.email}</p>
              <span className={`status-badge ${member.status}`}>
                {member.status === 'pending' ? 'Invitation Sent' : 'Active'}
              </span>
            </div>
            
            <div className="member-actions">
              <select 
                value={member.role} 
                onChange={(e) => handleRoleChange(member.id, e.target.value as MemberRole)}
                disabled={member.status === 'pending'}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              
              <button 
                onClick={() => handleRemove(member.id)}
                className="remove-btn"
                disabled={member.role === 'admin'}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="invite-section">
        <h3>Invite New Members</h3>
        <form onSubmit={handleInvite} className="invite-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          
          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value as MemberRole)}>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
          
          <button type="submit" className="invite-btn">Send Invitation</button>
        </form>
      </div>
    </div>
  );
}

export default HouseholdMembers;