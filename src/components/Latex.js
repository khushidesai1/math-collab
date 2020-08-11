import MathJax from 'react-mathjax';
import ReactDOM from 'react-dom';
import React from 'react';

export default class Latex extends React.Component {

    constructor(props) {
        super(props);
    }
    
    componentDidMount(){
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }
    
    componentDidUpdate() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, ReactDOM.findDOMNode(this)]);
    }
    
    render() {
        //dangerouslySetInnerHTML={{__html: this.props.children}}
        return (
             <h5 dangerouslySetInnerHTML={{__html: this.props.children}}></h5>
        );
    }
}
