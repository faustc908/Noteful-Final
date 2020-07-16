import React from "react";
import ApiContext from "../ApiContext";
import config from '../config';
import ValidationError from '../ValidationError'
import './AddFolder.css'
import PropTypes from 'prop-types';

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  state = {
    error: null,
    errorMessage: '',
    name: {
      value: ''
    },
  };

  updateName(name) {
    this.setState({name: {value: name}})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name } = this.state;
    const newFolder = {
      name: name.value,
    }

    if (name.value.trim().length === 0) {
      this.setState({
        errorMessage: "Folder name is required"
      })
    } 
    else {
      this.setState({ error: null })
      fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        body: JSON.stringify(newFolder),
        headers: {
          'content-type': 'application/json'
        },
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error
          })
        }
        return response.json()
      })
      .then(data => {
        name.value = ''
        this.context.addFolder(data)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
    }
  }

  render() {
    const {error} = this.state;
    const noteError = this.state.errorMessage;
    return (
      <ApiContext.Consumer>
        {(context) => (
          <form className="form" onSubmit={this.handleSubmit}>
            <h2>Add Folder</h2>
            <label htmlFor="folder">Folder Name:</label>
            <input
              type="text"
              className="folder-control"
              name="folder"
              id="folder"
              onChange={e => this.updateName(e.target.value)}
            />
            <button>Submit</button>
            <div className='error' role='alert'>
              {error && <p>{error.message}</p>}
              <ValidationError message={noteError}/>
            </div>
          </form>
        )}
      </ApiContext.Consumer>
    );
  }
}


AddFolder.propTypes = {
  name: PropTypes.string
};
