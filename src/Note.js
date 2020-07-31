import React, { useState, useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify'
import { updateUser as UpdateUser } from './graphql/mutations';
import { getUser } from './graphql/queries';
import { onUpdateUser } from './graphql/subscriptions';
import { v4 as uuidv4 } from 'uuid';
import MathEditor from './MathEditor';
import { initialValue, loadingValue } from './noteValues';

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
    const [user, setUser] = useState(null);
    const [noteState, dispatch] = useReducer(reducer, note);
    const [noteLoaded, setNoteLoaded] = useState(false);

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
                return action.post
            default:
                throw new Error();
        }
    }

    function doesContainNote(noteId, notes) {
        notes.forEach(n => {
            if (n.id === noteId) {
                return true;
            }
        });
        return false;
    }

    function findNote(noteId, notes) {
        notes.forEach(n => {
            if (n.id === noteId) {
                return n;
            }
        })
    }

    async function fetchCurrentUser(userId) {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: userId }));
            setUser(userData.data.getUser);
        } catch (err) {
            console.log("user does not exist!");
        }
    }

    async function createNewNote(note, dispatch) {
        const notesData = user.notes;
        if (!doesContainNote(note.id, notesData)) {
            dispatch({
                type: 'updateNote',
                note: {
                    ...note,
                    clientId: CLIENTID
                }
            })
        } else {
            var existingNote = findNote(note.id, notesData);
            dispatch({
                type: 'updateNote',
                note: {
                    ...existingNote,
                    clientId: CLIENTID
                }
            })
        }
    }

    async function updateUser(note) {
        try {
            await API.graphql(graphqlOperation(UpdateUser, { input: user }));
        } catch (err) {
            console.log('error: ', err);
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
            updateUser(newNote);
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
        updateUser(newNote);
    }

    useEffect(() => {
        const subscriber = API.graphql
    }, []);
}

export default Note;