import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { onCreateNote } from './graphql/subscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import './index.css';
import { pastelPurple, pastelDarkPurple, pastelSilver, pastelLightPurple, pastelMediumPurple } from './pastelPurple';
import { Typography, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SquareButton from './components/SquareButton';
import SquareTextField from './components/SquareTextField';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: pastelPurple[500],
      },
    },
});

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
        <div className="center-align" style={{ paddingLeft: window.innerWidth/3.5, paddingTop: window.innerWidth/8, backgroundColor: pastelLightPurple, width: window.innerWidth, height: window.innerHeight }}>            
            <div className="center-align" style={{ whiteSpace: 'break-spaces' }}>
                <Typography style={{ fontFamily: 'Mulish', fontSize: 100, fontWeight: 300, color: pastelDarkPurple, width: window.innerWidth/2.3, textAlign: 'center' }}>MathCollab</Typography>
                <Typography style={{ fontFamily: 'Mulish', fontSize: 18, fontWeight: 300, color: pastelDarkPurple, width: window.innerWidth/2.3, textAlign: 'center' }}>
                    MathCollab lets you type math symbols and equations with ease while collaborating with others.
                    You can share your note link with others and contribute to each other's notes. Start by creating a new note
                    or by joining someone else's note.
                </Typography>
                <p></p>
                <div className="center-align" style={{ whiteSpace: 'break-spaces', display: 'flex', flexDirection: 'row', flex: 1, width: window.innerHeight }}>
                    <ThemeProvider theme={theme}>
                        <SquareButton style={{ fontFamily: 'Mulish' }} onClick={toggle}>Create new Note</SquareButton>
                        <span>            </span>
                        <SquareTextField style={{ fontFamily: 'Mulish', width: window.innerWidth/5 }} onChange={onLinkChange} placeholder="Enter Note link"></SquareTextField>
                        <span>  </span>
                        <Link to={link} style={{ textDecoration: 'none'}}>
                            <SquareButton style={{ fontFamily: 'Mulish' }}>Join Note</SquareButton>
                        </Link>
                    </ThemeProvider>
                </div>
            </div>
            <Dialog
            open={isOpen}
            maxWidth='sm'
            PaperProps={{
                style: {
                    height: window.innerHeight/3,
                    backgroundColor: pastelSilver,
                }
            }}
            >
                <DialogTitle>
                    <Typography style={{ color: pastelDarkPurple, fontFamily: 'Mulish' }}>
                    Enter a title for your post:
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <ThemeProvider theme={theme}>
                        <SquareTextField
                        style={{ fontFamily: 'Mulish' }}
                        placeholder="Note title"
                        onChange={onChange}
                        input={input}
                        style={{ width: 300 }}
                        >
                        </SquareTextField>
                    </ThemeProvider>
                    <div style={{ whiteSpace: 'break-spaces' }}>
                        <p></p>
                        <div style={{ whiteSpace: 'break-spaces', flexDirection: 'row', flex: 1, display: 'flex' }}>
                            <SquareButton style={{ fontFamily: 'Mulish' }} onClick={toggle}>Cancel</SquareButton>
                            <span>    </span>
                            <SquareButton style={{ fontFamily: 'Mulish' }} onClick={navigate}>Create Note</SquareButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Navigation;