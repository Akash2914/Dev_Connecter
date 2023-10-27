import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ experience }) => {
  const { company, title, location, current, to, from, description } =
    experience;
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Moment format='YYY/MM/DD'>{from}</Moment> -{' '}
        {!to ? 'Now' : <Moment format='YYYY/MM/DD'></Moment>}
      </p>
      <p>
        <strong>Position:</strong>
        {title}
      </p>
      <p>
        <strong>Description:</strong>
        {description}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
