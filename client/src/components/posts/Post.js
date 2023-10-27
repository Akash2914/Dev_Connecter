import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSinglePost } from '../../actions/Post_action';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getSinglePost, post: { post, loading } }) => {
  const { id } = useParams();
  useEffect(() => {
    getSinglePost(id);
  }, [getSinglePost]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};
Post.propTypes = {
  getSinglePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getSinglePost })(Post);
