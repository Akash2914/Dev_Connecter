import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Profile from '../profile/Profile';

const ProfileItem = ({ profile }) => {
  console.log('profileitem');
  return (
    <div className='profile bg-light'>
      <img src={profile?.user?.avatar} alt='avatar' className='round-img' />
      <div>
        <h2>{profile?.user?.name}</h2>
        <p>
          {profile?.status}{' '}
          {profile?.company && <span> at {profile?.location}</span>}
        </p>
        <Link to={`/profile/${profile?.user?._id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
        {profile?.skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check'>{skill}</i>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
