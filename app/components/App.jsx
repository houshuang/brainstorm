import React from 'react';
import Ideas from './Ideas';
import TextInput from './mine/TextInput';
import {Socket} from '../vendor/phoenix';
import R from 'ramda';
import {PageHeader} from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.vote = this.vote.bind(this);
    this.comment = this.comment.bind(this);
    this.addItem = this.addItem.bind(this);
    var userstate = JSON.parse(document.getElementById("userstate").innerHTML);

    this.state = {
      dbstate: [],
      intstate: {},
      userstate: userstate,
      chan: null
    }
  }
  componentWillMount() {
    var socket
    if (!this.state.userstate.dev) {
      socket = new Socket("/ws")
    } else {
      socket = new Socket("ws://localhost:8000/ws")
    }

    socket.connect()
    let chan = socket.chan("brainstorm:" + this.state.userstate.room, {user: this.state.userstate.user_id})
    chan.join()
    chan.on('join', e => {
      this.setState( { dbstate: e.state, chan: chan } )
    })
    chan.on('new:state', e => {
      this.setState( { dbstate: e.state } )
    })
  }
  render() {
    const ideas = R.sortBy(R.compose(R.negate, R.prop('score')), this.state.dbstate);
    return (
      <div>
      <PageHeader>Ideas</PageHeader>
      <div dangerouslySetInnerHTML={{__html: this.state.userstate.intro}} />
      <TextInput
        placeholder={'Enter a new idea and press Enter to submit'}
        minLength={10}
        onEnter={this.addItem} />
      <Ideas items={ideas} vote={this.vote} comment={this.comment} />
      </div>
    );
  }
  addItem(val) {
    this.state.chan.push('new:op', ["new_idea", val])
  };

  vote(id) {
    this.state.chan.push('new:op', ["vote", id])
  }

  comment(id, val) {
    this.state.chan.push('new:op', ["new_comment", id, val])
  }
}
