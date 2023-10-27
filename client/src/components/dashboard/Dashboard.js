import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { deleteAccount, getCurrentProfile } from '../../actions/Profile_action';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getCurrentProfile,
  auth,
  deleteAccount,
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
    console.log('auth:', auth);
    console.log('profile:', profile);
  }, [getCurrentProfile]);
  if (loading && profile === null) {
    return <Spinner />;
  }
  return (
    <>
      <h1 className='large text-primary'>DashBoard</h1>
      <p className='lead'>
        <i className='fas fa-user'>Welcome {auth?.user && auth?.user.name}</i>
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'>Delete My Account</i>
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet set a profile, please add some infor</p>
          <Link to='/create-profile' className='my-1 brn btn-primary'>
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { deleteAccount, getCurrentProfile })(
  Dashboard
);
