const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const user = require('../../models/User');
const Post = require('../../models/Post');

//! route  GET api/profile/me
//! desc   Get current users profile
//! access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//! route  POST api/profile/
//! desc   post current users profile
//! access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //! Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (typeof skills === 'string') {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    } else {
      // Handle the case where skills is not a string (e.g., set it to an empty array)
      profileFields.skills = [];
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //! update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //! create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//! route  GET api/profile/user/user_id
//! desc   Get current users profile
//! access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('server error');
  }
});

//! route  POST api/profile/
//! desc   delete user or profile
//! access Private
router.delete('/', auth, async (req, res) => {
  try {
    //! Remove user post
    await Post.deleteMany({ user: req.user.id });
    //! Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //! Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});
//! route  POST api/profile/experience
//! desc   add profile experience details
//! access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//! route  POST api/profile/experience/:exp_id
//! desc   Delete experience details
//! access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile.experience.length <= 0) {
      res.json('No Experience found');
    }
    //! Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
//! route  POST api/profile/education
//! desc   add education details
//! access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//! route  POST api/profile/education/:edu_id
//! desc   Delete educaation details
//! access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile.education.length <= 0) {
      res.json('No Education found');
    }
    //! Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
//! route  GET api/profile/github/:username
//! desc   get user repos from github
//! access public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sory=created:asc&client_id`,
    };
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
//! route  GET api/profile/
//! desc   get allprofiles
//! access public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
