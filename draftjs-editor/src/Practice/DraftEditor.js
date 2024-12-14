import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const savedData = localStorage.getItem('editorContent');
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const customStyleMap = {
    RED: {
      color: 'red',
    },
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const blockText = block.getText();

    if (blockText === '#' && chars === ' ') {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ''
      );
      const headingEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-block-type'
      );
      setEditorState(RichUtils.toggleBlockType(headingEditorState, 'header-one'));
      return 'handled';
    }

    if (blockText === '*' && chars === ' ') {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ''
      );
      const boldEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-inline-style'
      );
      setEditorState(RichUtils.toggleInlineStyle(boldEditorState, 'BOLD'));
      return 'handled';
    }

    if (blockText === '**' && chars === ' ') {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ''
      );
      const redEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-inline-style'
      );
      setEditorState(RichUtils.toggleInlineStyle(redEditorState, 'RED'));
      return 'handled';
    }

    if (blockText === '***' && chars === ' ') {
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: blockText.length,
        }),
        ''
      );
      const underlineEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-inline-style'
      );
      setEditorState(RichUtils.toggleInlineStyle(underlineEditorState, 'UNDERLINE'));
      return 'handled';
    }

    return 'not-handled';
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem('editorContent', JSON.stringify(convertToRaw(contentState)));
    alert('Content saved to localStorage.');
  };

  return (
    <div className="editor-container">
      <input
        type="text"
        placeholder="Title"
        className="editor-title"
      />
      <Editor className="text-area"
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={customStyleMap}
      />
      <button className="save-button" onClick={saveContent}>
        Save
      </button>
    </div>
  );
};

export default DraftEditor;
