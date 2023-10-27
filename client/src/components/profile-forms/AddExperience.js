import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { addExperience } from '../../actions/Profile_action';
import { Link } from 'react-router-dom';
const AddExperience = ({ addExperience, navigateCallback }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: 'false',
    description: '',
  });
  const [toDateDisabled, setToDateDisabled] = useState(false);
  const { company, title, location, from, to, current, description } = formData;
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form
        className='form'
        onSubmit={(e) => {
          e.preventDefault();
          addExperience(formData, navigateCallback);
        }}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Job Title'
            name='title'
            value={title}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Company'
            name='company'
            value={company}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            value={location}
            onChange={(e) => handleChange(e)}
            name='location'
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
            Current Job
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
            placeholder='Job Description'
            value={description}
            onChange={(e) => handleChange(e)}
          ></textarea>
        </div>
        <input type='submit' className='my-1 btn btn-primary' />
        <Link to='/dashboard' className='my-1 btn btn-light'>
          Go Back
        </Link>
      </form>
    </>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};
export default connect(null, { addExperience })(AddExperience);
