import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { onCreateNote } from './graphql/subscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

const Navigation = (props) => {
    
    const [input, updateInput] = useState('');
    const [isOpen, toggleModal] = useState(false);
    const [link, updateLink] = useState('');

    function toggle() { toggleModal(!isOpen) };
    function onChange(e) { updateInput(e.target.value) };
    function onLinkChange(e) { updateLink(e.target.value) };

    function navigate() {
        if (input === '') return
        const id = uuidv4();
        const url = `/note/${id}/${input}`;
        props.history.push(url);
    }

    return (
        <div>            
            <button onClick={toggle}>Create New Note</button>
            <div>
                <input onChange={onLinkChange} placeholder="Enter Note Link"></input>
                <Link to={link}>
                    <button>Join Note</button>
                </Link>
            </div>
            <div>
                {
                    isOpen && 
                    <Modal
                    onChange={onChange}
                    input={input}
                    navigate={navigate}
                    toggle={toggle}
                    ></Modal>
                }
            </div>
        </div>
    );
}

export default Navigation;

const Modal = ({ onChange, input, navigate, toggle }) => (
    <div>
        <input
        placeholder="Note Title"
        onChange={onChange}
        value={input}
        key="input"
        >
        </input>
        <button onClick={navigate}>Create Post</button>
        <button onClick={toggle}>Cancel</button>
    </div>
);
