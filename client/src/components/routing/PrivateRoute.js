import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({
  element: Element,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  console.log('Auth State:', isAuthenticated, loading);
  if (isAuthenticated && !loading) {
    return Element;
  }

  return <Navigate to='/login' replace={true} />; // Use Navigate to redirect to the login page
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
