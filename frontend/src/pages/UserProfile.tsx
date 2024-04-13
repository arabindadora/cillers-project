import React, {useEffect, useState} from 'react';
import {getUser, signOut} from '../services/authService';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); //state to store user data
  

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();
      setUser(userData);
    };
      fetchUserData();
    }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">My Account</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={signOut}>
          Sign out
          </button>
        </div>
      </div>
      <div className='d-flex align-items-content justify-content-center'>
    <div className="card w-96 bg-primary text-primary-content shadow-xl" style={{marginTop: '120px'}}>
      <div>
        {user && (
          <figure>
            <img className="" src={user.profile.picture} alt="User Avatar" />
            <div className='card-body'>
            <div className="profile-name">{user.profile.name}</div>
            <div className="profile-favorites">
              <h2>Favorite Games</h2>
              {/* Display favorite games or any other user-specific information */}
              <p>Favorite 1</p>
              </div>
            </div>
          </figure>
        )}
      </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
