import React from 'react'

export default React.createContext({
  notes: [],
  folders: [],
  addFolder: () => {},
  handleAddNote: () => {},
  deleteNote: () => {},
})
