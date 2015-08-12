import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default class Presence extends React.Component {
  constructor(props) {
    items: Array;
    super(props);

  }
  render() {
    return <p>People online: {this.props.items.length}</p>  }
}

