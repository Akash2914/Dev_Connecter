import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileById } from '../../actions/Profile_action';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = ({
  getProfileById,
  auth,
  profile: { profile, loading },
  userId,
}) => {
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById]);
  if (profile === null) {
    return <h1>No Profiles Found</h1>;
  }
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Link to={'/profiles'} className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth?.isAuthenticated &&
            auth?.loading === false &&
            auth?.user?._id === profile?.user?._id && (
              <Link to={'/edit-profile'} className='btn btn-dark'>
                {' '}
                Edit Profile
              </Link>
            )}
          <div className='my-1 profile-grid'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='p-2 bg-white profile-exp'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience?._id}
                      experience={experience}
                    />
                  ))}
                </>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>
            <div className='p-2 bg-white profile-edu'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu?._id} education={edu} />
                  ))}
                </>
              ) : (
                <h4>No Education Credentials</h4>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
