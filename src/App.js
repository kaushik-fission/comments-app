import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("http://www.mocky.io/v2/5dc596503200008200769be8/")
      .then(response => response.json())
      .then(response => {
        setComments([...response]);
      })
      .catch(err => {
        console.log(err);
      });
  }, [])

  return (
    <div className="App">
      <ul className="parent-container">
        {comments.map((parentComment) => (
          <CommentComponent
            comment={parentComment}
            key={parentComment._id}
          />
        ))}
      </ul>
    </div>
  );
}

const CommentComponent = ({ comment }) => {
  const [showChildrenComments, setShowChildrenComments] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [currentComment, setCurrentComment] = useState(comment);

  const hasChildren = !!currentComment.children;

  // set show or hide children comments
  const setShowChildren = () => {
    setShowChildrenComments(!showChildrenComments);
  }

  // add current comment to the parent list
  const replyToComment = (id) => {
    if (commentValue.length) {
      const commentCopy = { ...comment };
      const newComment = {
        _id: Date.now().toString(),
        comment: commentValue,
        children: []
      }
      commentCopy.children.push({ ...newComment })

      setCommentValue('');
      setCurrentComment(commentCopy);
    }
  }

  return (
    <li key={currentComment._id}>
      <div>{currentComment.comment}</div>
      {
        hasChildren &&
        <div>
          <textarea
            name="textArea"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            key={currentComment._id}
          />
        </div>
      }
      <div>
        <div>
          {!!hasChildren && <button className='reply' onClick={() => replyToComment(currentComment._id)}>reply</button>}
        </div>
        <div>
          {hasChildren && currentComment.children.length > 0 && !showChildrenComments && <button className='show' onClick={() => setShowChildren()}>Show Comments</button>}
        </div>
        <div>
          {hasChildren && currentComment.children.length > 0 && !!showChildrenComments && <button className='hide' onClick={() => setShowChildren()}>Hide Comments</button>}
        </div>
      </div>
      <div className="children-container">
        {hasChildren && currentComment.children.length > 0 && !!showChildrenComments && (
          <ul>
            {hasChildren && currentComment.children.length > 0 && currentComment.children.map((item) => (
              <CommentComponent
                comment={item}
                key={item._id}
                replyToComment={replyToComment}
                setShowChildren={setShowChildren}
                showChildrenComments={showChildrenComments}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default App;
