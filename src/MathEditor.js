import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from './components'
import { FormatBold, FormatItalic, FormatUnderlined, 
        Code, FormatListNumbered, FormatListBulleted, 
        LooksOne, LooksTwo, FormatQuote } from '@emotion-icons/material';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const MathEditor = (props) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])

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
          if (event.key === "\\") {
            handleMathBlock();
          }
        }}
      />
    </Slate>
  )
}

const handleMathBlock = () => {

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