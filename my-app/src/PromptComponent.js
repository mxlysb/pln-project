import React, { Component } from 'react';

class PromptComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      isPromptVisible: false,
    };
  }

  handlePromptOpen = () => {
    this.setState({ isPromptVisible: true });
  };

  handlePromptClose = () => {
    this.setState({ isPromptVisible: false });
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handlePromptSubmit = () => {
    const inputValue = this.state.inputValue;
    this.props.onValueSubmit(inputValue);
    this.handlePromptClose();
  };
  

  render() {
    return (
      <div>
        <button onClick={this.handlePromptOpen}>Digite artistas</button>
        {this.state.isPromptVisible && (
          <div className="prompt">
            <input
              type="text"
              value={this.state.inputValue}
              onChange={this.handleInputChange}
            />
            <button onClick={this.handlePromptSubmit}>Enviar</button>
            <button onClick={this.handlePromptClose}>Cancelar</button>
          </div>
        )}
      </div>
    );
  }
}

export default PromptComponent;
