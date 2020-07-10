import React from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from '../ValidationError';
import PropTypes from "prop-types";
import './AddNote.css'

export default class AddNote extends React.Component {
  static contextType = ApiContext;

  state = {
    error: null,
    errorMessage: '',
    name: {
      value: ''
    },
    folderId: {
      value: ''
    },
    content: {
      value: ''
    },
  };

 

  updateName(name) {
    this.setState({name: {value: name}})
  }
  
  updateFolderId(id) {
    this.setState({folderId: {value: id}})
  }
  
  updateContent(content) {
    this.setState({content: {value: content}})
  }

  handleSubmit = event => {
    event.preventDefault();

    const { name, content, folderId } = this.state;
    const newNote = {
      name: name.value,
      folderId: folderId.value,
      content: content.value
    };  

    if (content.value.trim().length === 0) {
      this.setState({
        errorMessage: "Note content is required"
      })
    } 
    else if(folderId.value.trim().length === 0) {
      this.setState({
        errorMessage: "Folder value required"
    })}
    else if(name.value.trim().length === 0) {
      this.setState({
        errorMessage: "Name must be entered"
    })}
    else {
      this.setState({ error: null })
      fetch(`${config.API_ENDPOINT}/notes`, {
        method: "POST",
        body: JSON.stringify(newNote),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(error => {
              throw error;
            });
          }
          return response.json();
        })
        .then(data => {
          name.value = "";
          content.value = "";
          folderId.value  = '';
          this.context.addNote(data);
          this.props.history.push("/");
        })
        .catch(error => {
          this.setState({ error });
        });
    }
  };

  render() {
    const { folders } = this.props;
    const {error} = this.state;
    
    const noteError = this.state.errorMessage;
    return (
      <ApiContext.Consumer>
        {context => (
          <form className="form" onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Add Note</legend>
              <label htmlFor="name">Note Name:</label>
              <input
                type="text"
                className="note-control"
                name="name"
                id="name"
                onChange={e => this.updateName(e.target.value)}
              />
              <label htmlFor="folder">Folder:</label>
              <select id="folder" onChange={e => this.updateFolderId(e.target.value)}>
                <option value={null}>...</option>
                {folders.map(folder => <option value={folder.id} key={folder.id}>{folder.name}</option>)}
              </select>
              <label htmlFor="content">Content:</label>
              <textarea 
                id="content" 
                name="content" 
                rows="5" 
                cols="30" 
                onChange={e => this.updateContent(e.target.value)}>
              </textarea>
            </fieldset>
            <button>Submit</button>
            <div className='error' role='alert'>
              {error && <p>{error.message}</p>}
              <ValidationError message={noteError} />
            </div>
          </form>
        )}
      </ApiContext.Consumer>
    );
  }
}

AddNote.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired
};

