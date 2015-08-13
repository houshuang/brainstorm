import React from 'react';
import Ideas from './Ideas';
import TextInput from './mine/TextInput';
import ChatForm from './mine/ChatForm';
import Presence from './mine/Presence';

import {Socket} from '../vendor/phoenix';
import R from 'ramda';
import _ from 'underscore';
import {PageHeader} from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.vote = this.vote.bind(this);
    this.say = this.say.bind(this);
    this.comment = this.comment.bind(this);
    this.archive = this.archive.bind(this);
    this.trash = this.trash.bind(this);
    this.addItem = this.addItem.bind(this);
    var userstate = JSON.parse(document.getElementById("userstate").innerHTML);

    this.state = {
      dbstate: [],
      intstate: {},
      brainstorm: [],
      userstate: userstate,
      chats: [],
      users_online: [],
      brainstorm_chan: null,
      chat_chan: null
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

    let brainstorm = socket.chan("brainstorm:" + this.state.userstate.room, {user: this.state.userstate.user_id})
    brainstorm.join()
    brainstorm.on('join', e => {
      this.setState( { dbstate: e.state, brainstorm_chan: brainstorm } )
    })
    brainstorm.on('new:state', e => {
      this.setState( { dbstate: e.state } )
    })

    let chat = socket.chan("rooms:" + this.state.userstate.room , {userid: this.state.userstate.user_id, usernick: this.state.userstate.user_nick })
    chat.join()
    chat.on('join', e => {
      console.log("chats", e)
      this.setState( { chats: e.previous, users_online: e.presence, chat_chan: chat })
    })
    chat.on('user:entered', e => {
      console.log("entered", e)
      let uo = this.state.users_online
      uo.push(e.usernick)
      this.setState( { users_online: _.compact(_.intersection(uo))})
    })
    chat.on('user:left', e => {
      console.log("left", e)
      this.setState ({ users_online: _.compact(_.without(this.state.users_online, e.userid)) })
    })
    chat.on('new:msg', e => {
      console.log("msg", e)
      let chats = this.state.chats
      chats.push(e)
      this.setState ({ chats: chats })
    })
    let control = socket.chan("control")
    control.join()
    control.on('reload', () => {
      window.location.reload()
    })
  }
  render() {
    const ideas = R.sortBy(R.compose(R.negate, R.prop('score')), this.state.dbstate);
    const idea_status = R.groupBy((idea) => idea.archived, ideas)
    var chatStyle = { float: 'left', maxWidth: '320px' }
    var ideaStyle = { float: 'right', maxWidth: '480px' }
    return (
      <div className='container-fluid'>
      <PageHeader>{ this.state.userstate.title }</PageHeader>
      <iframe width="560" height="315" src={ this.state.userstate.embed } frameBorder="0" allowFullScreen></iframe>
     <br />
      <Presence items={this.state.users_online} />
      <div className='row'>

      <div style={chatStyle}>
      { this.state.userstate.chat_enabled ?
      <ChatForm chats={this.state.chats} say={this.say}/>
      : "" }
      </div><div style={ideaStyle}>
      <TextInput
        placeholder={'Enter a new idea and press Enter to submit'}
        minLength={10}
        onEnter={this.addItem} />
      <Ideas items={idea_status["undefined"] || []} vote={this.vote} comment={this.comment} admin={this.state.userstate.admin} archive={this.archive} trash={this.trash}/>
      { idea_status["true"] ? <h2>Archived</h2> : "" }
      <Ideas items={idea_status["true"] || []} vote={this.vote} comment={this.comment} admin={this.state.userstate.admin} archive={this.archive} trash={this.trash}/>
      { this.state.userstate.admin ? <div><h2>Trash</h2>
      <Ideas items={idea_status["trash"] || []} vote={this.vote} comment={this.comment} admin={this.state.userstate.admin} archive={this.archive} trash={this.trash}/></div> : "" }
      </div>
      </div>
      </div>
    );
  }
  addItem(val) {
    this.state.brainstorm_chan.push('new:op', ["new_idea", val])
  };

  vote(id) {
    this.state.brainstorm_chan.push('new:op', ["vote", id])
  }

  archive(id) {
    this.state.brainstorm_chan.push('new:op', ["archive", id])
  }

  trash(id) {
    this.state.brainstorm_chan.push('new:op', ["trash", id])
  }

  comment(id, val) {
    this.state.brainstorm_chan.push('new:op', ["new_comment", id, val])
  }

  say(val) {
    this.state.chat_chan.push('new:msg', { user: this.state.userstate.user_nick, body: val })
  }
}
