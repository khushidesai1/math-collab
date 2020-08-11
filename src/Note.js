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
import NoteTitleTextField from './components/NoteTitleTextField';
import SquareButton from './components/SquareButton';
import { Alert } from '@material-ui/lab';
import { Collapse, Popper, Paper } from '@material-ui/core';
import { pastelSilver, pastelDarkPurple } from './pastelPurple';

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
    const [anchor, setAnchor] = useState(null);
    const [saveAlert, setSaveAlert] = useState(true);

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
        <div style={{ paddingLeft: window.innerWidth/12, paddingTop: window.innerWidth/20, backgroundColor: pastelSilver, width: window.innerWidth, height: window.innerHeight }}>
            <Collapse in={saveAlert}>
                <Alert onClose={() => setSaveAlert(false)} style={{ width: window.innerWidth/1.26}} severity="info">
                    This is a temporary note unless you are signed in. The link to this note will be removed 30 days after creation. To save this note, sign in. 
                </Alert>
            </Collapse>
            <p></p>
            <div style={{ padding: 35, backgroundColor: '#fff', elevation: 3, width: window.innerWidth/1.3, height: window.innerHeight/1.2 }}>
                <div style={{ whiteSpace: 'break-spaces', flex: 4, flexDirection: 'row', display: 'flex' }}>
                    <NoteTitleTextField value={noteState.title} onChange={updateNoteTitle} placeholder="Note title"></NoteTitleTextField>
                    <span>                                                                                         </span>
                    <SquareButton style={{ fontFamily: 'Mulish' }} onClick={(event) => {setAnchor(anchor ? null : event.currentTarget)}}>Get shareable link</SquareButton>
                    <Popper anchorEl={anchor} open={Boolean(anchor)}>
                        <Paper elevation={2} style={{ fontFamily: 'Mulish', padding: 10, backgroundColor: '#fff', borderRadius: 0 }}>
                            {useLocation().pathname}
                        </Paper>
                    </Popper>
                </div>
                <p></p>
                <MathEditor value={JSON.parse(noteState.content)} onChange={newValue => updateContent(newValue)} ></MathEditor>
            </div>
        </div>
    );
}

export default Note;