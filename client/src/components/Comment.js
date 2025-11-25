import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";
import CommentEditor from "./CommentEditor";
import ContentDetails from "./ContentDetails";
import { deleteComment, updateComment } from "../api/posts";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { BsReplyFill } from "react-icons/bs";
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from "react-icons/ai";
import Moment from "react-moment";

const Comment = (props) => {
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment.commenter._id;
  const navigate = useNavigate();

  const handleSetReplying = () => {
    if (isLoggedIn()) {
      setReplying(!replying);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    await updateComment(comment._id, user, { content });
    const newCommentData = { ...comment, content, edited: true };
    setComment(newCommentData);
    editComment(newCommentData);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteComment(comment._id, user);
    removeComment(comment);
  };

  // Enhanced styling based on depth
  const getContainerClass = () => {
    const baseClass = "mb-3 rounded";
    if (props.profile) return `${baseClass} border-start border-primary ps-3`;
    
    if (depth === 0) return `${baseClass} border bg-light`;
    return `${baseClass} border bg-white`;
  };

  const getDepthMargin = () => {
    if (depth === 0) return "";
    return `ms-${Math.min(depth * 3, 12)}`;
  };

  return (
    <div className={`${getContainerClass()} ${getDepthMargin()}`}>
      
      {/* Profile View */}
      {props.profile ? (
        <div className="p-2">
          <h6 className="mb-1">
            <Link 
              to={"/posts/" + comment.post._id}
              className="text-decoration-none text-dark fw-semibold hover-primary"
            >
              {comment.post.title}
            </Link>
          </h6>
          <div className="d-flex align-items-center gap-2 text-muted">
            <small>
              <Moment fromNow>{comment.createdAt}</Moment>
            </small>
            {comment.edited && (
              <span className="badge bg-secondary bg-opacity-25 text-secondary">Edited</span>
            )}
          </div>
        </div>
      ) : (
        
        /* Regular Comment View */
        <div className="p-3">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <ContentDetails
                username={comment.commenter.username}
                createdAt={comment.createdAt}
                edited={comment.edited}
              />
              
              {/* Minimize Toggle */}
              <button
                className="btn btn-sm btn-light border-0 rounded-circle"
                onClick={() => setMinimised(!minimised)}
                title={minimised ? "Expand comment" : "Minimize comment"}
                style={{ width: '28px', height: '28px' }}
              >
                {minimised ? (
                  <AiOutlinePlus size={12} className="text-muted" />
                ) : (
                  <AiOutlineLine size={12} className="text-muted" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            {!minimised && (
              <div className="d-flex align-items-center gap-1">
                {/* Reply Button */}
                <button
                  className={`btn btn-sm ${replying ? 'btn-warning' : 'btn-outline-primary'} border-0`}
                  onClick={handleSetReplying}
                  title={replying ? "Cancel reply" : "Reply to comment"}
                >
                  {replying ? (
                    <>
                      <MdCancel size={14} className="me-1" />
                      <span className="d-none d-sm-inline">Cancel</span>
                    </>
                  ) : (
                    <>
                      <BsReplyFill size={12} className="me-1" />
                      <span className="d-none d-sm-inline">Reply</span>
                    </>
                  )}
                </button>

                {/* Author/Admin Actions */}
                {user && (isAuthor || user.isAdmin) && (
                  <div className="d-flex align-items-center gap-1 ms-1">
                    {/* Edit Button */}
                    <button
                      className={`btn btn-sm ${editing ? 'btn-warning' : 'btn-outline-warning'} border-0`}
                      onClick={() => setEditing(!editing)}
                      title={editing ? "Cancel edit" : "Edit comment"}
                    >
                      {editing ? (
                        <MdCancel size={14} />
                      ) : (
                        <AiFillEdit size={13} />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={handleDelete}
                      title="Delete comment"
                    >
                      <BiTrash size={13} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Content Area */}
          {!minimised && (
            <div className="comment-body">
              
              {/* Comment Text / Editor */}
              <div className="mb-3">
                {!editing ? (
                  <div className="comment-text p-2 rounded bg-white border">
                    <Markdown content={comment.content} />
                  </div>
                ) : (
                  <div className="editing-area p-3 bg-light rounded border">
                    <ContentUpdateEditor
                      handleSubmit={handleSubmit}
                      originalContent={comment.content}
                    />
                  </div>
                )}
              </div>

              {/* Reply Editor */}
              {replying && (
                <div className="reply-section mt-3 p-3 bg-light rounded border">
                  <CommentEditor
                    comment={comment}
                    addComment={addComment}
                    setReplying={setReplying}
                    label="What are your thoughts on this comment?"
                  />
                </div>
              )}

              {/* Nested Comments */}
              {comment.children && comment.children.length > 0 && (
                <div className="nested-comments mt-3 pt-2 border-top">
                  {comment.children.map((reply) => (
                    <Comment
                      key={reply._id}
                      comment={reply}
                      depth={depth + 1}
                      addComment={addComment}
                      removeComment={removeComment}
                      editComment={editComment}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;