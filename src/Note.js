import React, { useState, useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify'
import { createNote, updateNote as UpdateNote } from './graphql/mutations';
import { getNote } from './graphql/queries';
import { onUpdateNote } from './graphql/subscriptions';
import { v4 as uuidv4 } from 'uuid';
import MathEditor from './MathEditor';
import { initialValue, loadingValue } from './noteValues';
import { useLocation } from 'react-router-dom'

const CLIENTID = uuidv4();
const loading = JSON.stringify(loadingValue);
const input = JSON.stringify(initialValue);

const Note = ({ match: { params } }) => {
    const note = {
        id: params.id,
        title: params.title,
        clientId: CLIENTID,
        content: loading,
    }
    const [noteState, dispatch] = useReducer(reducer, note);
    const [noteLoaded, setNoteLoaded] = useState(false);
    const [linkHidden, toggleLinkHidden] = useState(true);

    function reducer(state, action) {
        switch (action.type) {
            case 'updateContent':
                return {
                    ...state,
                    content: action.content,
                    clientId: CLIENTID,
                }
            case 'updateTitle':
                return {
                    ...state,
                    title: action.title,
                    clientId: CLIENTID,
                }
            case 'updateNote':
                return action.note
            default:
                throw new Error();
        }
    }

    async function createNewNote(note, dispatch) {
        try {
            const noteData = await API.graphql(graphqlOperation(createNote, { input: note }));
            dispatch({
                type: 'updateNote',
                note: {
                    ...noteData.data.createNote,
                    clientId: CLIENTID
                }
            })
        } catch (err) {
            const existingNoteData = await API.graphql(graphqlOperation(getNote, { id: note.id }));
            dispatch({
                type: 'updateNote',
                note: {
                    ...existingNoteData.data.getNote,
                    clientId: CLIENTID
                }
            })
        }
    }

    async function updateNote(note) {
        try {
            await API.graphql(graphqlOperation(UpdateNote, { input: note }));
        } catch (err) {
            console.log("could not update note: ", err);
        } 
    }

    useEffect(() => {
        const note = {
            ...noteState,
            content: input
        }
        createNewNote(note, dispatch);
    }, []);

    function updateContent(newValue) {
        dispatch({
            type: 'updateContent',
            content: JSON.stringify(newValue),
        })
        const newNote = {
            id: note.id,
            content: JSON.stringify(newValue),
            clientId: CLIENTID,
            createdAt: note.createdAt,
            title: noteState.title
        }
        if (noteLoaded) {
            updateNote(newNote, dispatch);
        }
        setNoteLoaded(true);
    }

    function updateNoteTitle(e) {
        dispatch({
            type: 'updateTitle',
            title: e.target.value
        })
        const newNote = {
            id: note.id,
            content: noteState.content,
            clientId: CLIENTID,
            createdAt: note.createdAt,
            title: e.target.value,
        }
        updateNote(newNote, dispatch);
    }

    useEffect(() => {
        const subscriber = API.graphql(graphqlOperation(onUpdateNote, {
            id: note.id
        })).subscribe({
            next: data => {
                var clientId = data.value.data.onUpdateNote.clientId;
                if (CLIENTID !== clientId) {
                    const noteFromSub = data.value.data.onUpdateNote;
                    dispatch({
                        type: 'updateNote',
                        note: noteFromSub
                    })
                } else {
                    return;
                }
            }
        });
        return () => subscriber.unsubscribe();
    }, []);

    return (
        <div>
            <input
            value={noteState.title}
            onChange={updateNoteTitle}
            placeholder="Note Title"
            ></input>
            <MathEditor value={JSON.parse(noteState.content)} onChange={newValue => updateContent(newValue)} ></MathEditor>
            <button onClick={() => toggleLinkHidden(!linkHidden)}>{linkHidden ? 'Get shareable link' : 'Hide link'}</button>
            <div hidden={linkHidden}>{useLocation().pathname}</div>
        </div>
    );
}

export default Note;