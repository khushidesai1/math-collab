import React, { useCallback, useMemo, useState, useEffect, memo, createRef } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor, Node, Block } from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './components'
import { FormatBold, FormatItalic, FormatUnderlined, 
        Code, FormatListNumbered, FormatListBulleted, 
        LooksOne, LooksTwo, FormatQuote, Functions } from '@emotion-icons/material';
import { Dialog, Paper } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'
import MathJax from 'react-mathjax';

addStyles();

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const MathEditor = (props) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <Slate {...props} editor={editor}>
      <Toolbar>
        <MarkButton format="bold" icon={<FormatBold style={{ marginTop: 5, width: 25, height: 25 }}/>} />
        <MarkButton format="italic" icon={<FormatItalic style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <MarkButton format="underline" icon={<FormatUnderlined style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <MarkButton format="code" icon={<Code style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="heading-one" icon={<LooksOne style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="heading-two" icon={<LooksTwo style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="block-quote" icon={<FormatQuote style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="numbered-list" icon={<FormatListNumbered style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="bulleted-list" icon={<FormatListBulleted style={{ marginTop: 5, width: 25, height: 25 }} />} />
        <BlockButton format="math-block" icon={<Functions style={{ marginTop: 5, width: 25, height: 25 }} />} />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }

  if (!isActive && format === "math-block") {
    Editor.insertNode(editor, {
      type: 'paragraph',
      children: [
        { text: "" }
      ]
    })
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const MathNode = memo(function MathNode(props) {

  const [open, setOpen] = useState(false);
  const [editorLatex, setEditorLatex] = useState(props.element.children[0].text);
  const [hidden, setHidden] = useState(true);
  const editor = useSlate();
  const mathRef = createRef();

  const updateText = (newText) => {
    setEditorLatex(newText);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const selectElement = (el) => {
    let range = document.createRange();
    range.selectNodeContents(el);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  return (
    <div style={{ width: 'max-content'}}>
      <div contentEditable={false} style={{ padding: 3, backgroundColor: '#F0F0F0', borderRadius: 3 }}>
        <StaticMathField onClick={() => {setHidden(!hidden); selectElement(document.getElementById("contentEl"));}} contentEditable={false}>{props.children}</StaticMathField>
      </div>
      <Dialog open={open}>
        <Paper autofocus elevation={0} style={{ padding: 20 }}>
          <EditableMathField
          latex={editorLatex}
          onChange={(mathField) => updateText(mathField.latex())}
          ></EditableMathField>
          <button onClick={handleClose}>Close</button>
        </Paper>
      </Dialog>
      <p hidden={hidden} style={{ color: "#808080" }} id="contentEl">
        {props.children}
      </p>
    </div>
  );
});

const Element = ({ attributes, children, element }) => {

  switch (element.type) {
    case 'block-quote':
      return <blockquote style={{ borderLeft: "3px solid #000000", padding: 8, color: "#808080" }} {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'math-block':
      return <MathNode title="math" attributes={attributes} children={children} element={element}></MathNode>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code style={{ padding: 2, borderRadius: 4, backgroundColor: "#DCDCDC" }}>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
        <Icon>{icon}</Icon>
    </Button>
  )
}

export default MathEditor