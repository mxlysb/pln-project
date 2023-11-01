import React, { Component } from 'react';

class InputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputSubmit = () => {
    const inputValue = this.state.inputValue;
    this.props.onValueSubmit(inputValue);
  };
  
  render() {
    return (
      <div>
        <input className='input'
          type="text"
          placeholder='Digite os artistas aqui...'
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <button className='send-button' onClick={this.handleInputSubmit}>Enviar</button>
      </div>
    );
  }
}

export default InputComponent;
