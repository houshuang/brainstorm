import React from 'react';
import {Button, Badge, Glyphicon} from 'react-bootstrap';
import TextInput from './mine/TextInput';

export default class Idea extends React.Component {
  constructor(props) {
    value: String;
    vote: Function;
    comment: Function;

    super(props);
    this.procComment = this.procComment.bind(this);

    this.state = {
      comment: false,
    };
  }
  render() {

    return <div>
    <div key={this.props.id}>
    <Badge>{this.props.score}</Badge>&nbsp;&nbsp;&nbsp;
    <a href="#"
    onClick={(e) => {
      this.props.vote(this.props.id)
      e.preventDefault() }}>
      <Glyphicon glyph='heart' /></a>
      &nbsp;&nbsp;&nbsp;
    <font size={4}>
    {this.props.value} </font><i>({this.props.nick}</i>)
    &nbsp;&nbsp;&nbsp;

      <a href="#" onClick={(e) => {
        this.setState({comment: !this.state.comment})
        e.preventDefault() }}>
        <Button bsSize='xsmall' bsStyle='success'>add a comment</Button></a>
        { this.state.comment? (
              <TextInput
        placeholder={'Press Enter to submit'}
        minLength={10}
        onEnter={this.procComment} />)
        : ''}
        { this.props.admin ? this.archiveButton() : "" }
        </div>
        </div>;
  }
  archiveButton() {
    return(
      <span>
      <a href="#" onClick={(e) => {
        this.props.archive(this.props.id)
        e.preventDefault() }}>
        &nbsp;
        &nbsp;
        <Button bsSize='xsmall' bsStyle='success'>archive</Button></a>
        &nbsp;&nbsp;
      <a href="#" onClick={(e) => {
        this.props.trash(this.props.id)
        e.preventDefault() }}>
        &nbsp;
        <Button bsSize='xsmall' bsStyle='success'>trash</Button></a>
        </span>
    )
  }

  procComment(value) {
    this.setState({comment: false})
    this.props.comment(this.props.id, value)
  }
}
