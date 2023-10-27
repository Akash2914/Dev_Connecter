import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { addEducation } from '../../actions/Profile_action';
import { Link } from 'react-router-dom';
const AddEducation = ({ addEducation, navigateCallback }) => {
  const [toDateDisabled, setToDateDisabled] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    from: '',
    to: '',
    current: 'false',
    description: '',
    fieldofstudy: '',
  });
  const { school, degree, from, fieldofstudy, to, current, description } =
    formData;
  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const handleSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, navigateCallback);
  };
  return (
    <>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-graduation-cap'></i> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            value={school}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            value={degree}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field Of Study'
            name='fieldofstudy'
            value={fieldofstudy}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                setToDateDisabled(!toDateDisabled);
              }}
            />
            Current School or Bootcamp
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={(e) => handleChange(e)}
            disabled={!toDateDisabled ? 'disabled' : ''}
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
            value={description}
            onChange={(e) => handleChange(e)}
          ></textarea>
        </div>
        <input type='submit' className='my-1 btn btn-primary' />
        <Link to={'/dashboard'} className='my-1 btn btn-light'>
          Go Back
        </Link>
      </form>
    </>
  );
};
AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
