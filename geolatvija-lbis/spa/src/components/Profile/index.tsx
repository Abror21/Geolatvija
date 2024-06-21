import React from 'react';
import { StyledProfile } from './styles';

interface ProfileProps {
  img: string;
  name: string;
  email: string;
}

const Profile = ({ img, name, email }: ProfileProps) => {
  return (
    <StyledProfile>
      <img className="profile-image" src={img} alt="logo" />
      <div>
        <div className="name">{name}</div>
        <div className="email">{email}</div>
      </div>
    </StyledProfile>
  );
};

export default Profile;
