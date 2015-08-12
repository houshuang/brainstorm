import React from 'react';
import {Input} from 'react-bootstrap';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.localchange = this.localchange.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.state = {text: ''}
  }

  render() {
    const {placeholder='', type='textarea', ...props} = this.props;

    return <div {...props}>
    <Input
    type={type}
    placeholder={placeholder}
    ref='input'
    value={this.state.text}
    bsStyle={this.validationState()}
    groupClassName='group-class'
    labelClassName='label-class'
    onChange={this.handlechange}
    onKeyDown={this.localchange} />
    </div>;
  }
  validationState() {
    const {minLength=0} = this.props
    console.log(minLength)
    if(minLength > 0 && this.state.text.length < minLength) {
      return 'error';
    } else {
      return 'success';
    }
  }
  handlechange(e) {
    this.setState({text: e.target.value});
  }
  localchange(e) {
    const {minLength=0} = this.props
    if(e.key === 'Enter') {
      e.preventDefault();
      if(!(minLength > 0 && this.state.text.length < minLength)) {
        let val = e.target.value;
        this.setState({text: ''});
        this.props.onEnter(val);
      }
    }
  }
}
