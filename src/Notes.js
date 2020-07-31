import React, { useState, useReducer, useEffect } from 'react';
import { getUser } from './graphql/queries';
import { onUpdateUser } from './graphql/subscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Notes = (props) => {
    
    const initialState = {
        notes: [],
        loading: true,
        error: false,
    }
    const [isOpen, toggleModal] = useState(false);
    const [input, updateInput] = useState('');
    const [notesState, dispatch] = useReducer(reducer, initialState);

    function toggle() { toggleModal(!isOpen) }
    function onChange(e) { updateInput(e.target.value) }

    async function fetchNotes(userId, dispatch) {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: userId }));
            dispatch({
                type: 'fetchNotesSuccess',
                posts: userData.data.getUser.notes,
            })
        } catch (err) {
            console.log('error fetching notes...: ', err);
            dispatch({
                type: 'fetchNotesError',
            })
        }
    }

    function navigate() {
        if (input === '') return
        const id = uuidv4();
        const url = `/note/${id}/${input}`;
        props.history.push(url);
    }

    useEffect(() => {
        var tempId = "46760c50-d1ec-11ea-9e9f-fff08c61775d";
        fetchNotes(tempId, dispatch)
    })
    
    useEffect(() => {
        const subscriber = API.graphql(graphqlOperation(onUpdateUser)).subscribe({
            next: data => {
                const notesFromSub = data.value.data.onUpdateUser.notes;
                dispatch({
                    type: 'updateNotesFromSubscription',
                    notes: notesFromSub,
                })
            }
        });
        return () => subscriber.unsubscribe();
    })

    function reducer(state, action) {
        switch (action.type) {
            case 'fetchNotesSuccess':
                return {
                    ...state,
                    notes: action.notes,
                    loading: false,
                }
            case 'updateNotesFromSubscription':
                return {
                    ...state,
                    notes: action.notes
                }
            case 'fetchNotesError':
                return {
                    ...state,
                    loading: false,
                    error: true,
                }
            default:
                throw new Error();
        }
    }

    return(
        <div>
            <div>Welcome to your dashboard</div>
            <div>
                <button onClick={toggle}>Create new Note</button>
            </div>
            <div>
                {
                    notesState.loading && (
                        <div>Loading...</div>
                    )
                }
            </div>
            <div>
                {
                    notesState.notes.map((n, i) => (
                        <div key={i}>
                            <Link to={`/note/${n.id}/${n.title}`}>
                                <h1>{n.title}</h1>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <div>
                {
                    isOpen && (
                        <Modal
                        onChange={onChange}
                        input={input}
                        navigate={navigate}
                        toggle={toggle}
                        />
                    )
                }
            </div>
        </div>
    );
}

export default Notes;

const Modal = ({ onChange, input, navigate, toggle }) => (
    <div>
        <input
        placeholder="Note title"
        onChange={onChange}
        value={input}
        key="input"
        />
        <button onClick={navigate}>Create Note</button>
        <button onClick={toggle}>Cancel</button>
    </div>
)