import _ from 'underscore';
import React from 'react';
import TextInput from './TextInput';
import moment from 'moment';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default class ChatForm extends React.Component {
  constructor(props) {
    chats: Array;
    say: Function;
    super(props);

  }
  render() {
    let chats = _.clone(this.props.chats)
    chats.reverse()
    return (
    <div>

      <TextInput
        placeholder={'What do you have to say?'}
        minLength={0}
        onEnter={this.props.say} />
        {_.map(chats, this.renderChat)}
    </div>)
  }
  renderChat(item, i) {
    console.log(item,i)
    return (
      <div>
<li className="message" key={`items${i}`}> <span className="messagetext">{ item.body }</span> (<span className="info"><span className="name"><em>{ item.user }</em></span></span>)</li>
  </div>
    );
  }

}

