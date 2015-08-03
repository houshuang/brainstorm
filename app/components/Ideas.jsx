import React from 'react';
import Idea from './Idea';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default class Ideas extends React.Component {
  constructor(props) {
    items: Array;
    vote: Function;
    super(props);

    this.renderIdea = this.renderIdea.bind(this);
    this.renderComment = this.renderComment.bind(this);
  }
  render() {
    const items = this.props.items;
    return <ListGroup className='item'>{items.map(this.renderIdea)}</ListGroup>;
  }
  renderIdea(item, i) {
    let comments;
    if(item.comments.length > 0) {
      comments = item.comments.map(this.renderComment)
    } else {
      comments = ""
    }
    return (
      <ListGroupItem className='item' key={`item${i}`}>
        <Idea
          value={item.idea} score={item.score} id={item.id} nick={item.user_nick}
          vote={this.props.vote} comment={this.props.comment}/>
          {comments}
      </ListGroupItem>
    );
  }

  renderComment(comment, i) {
    return (
      <ListGroupItem className='comment' key={`comment${i}`}>
      {comment.comment}, <i>said {comment.user_nick}</i>
      </ListGroupItem>
    );
  }
}
