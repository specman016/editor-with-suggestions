import React from "react";
import uuid from "uuid";

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    preloadedContent = `<div>here is some content for the div</div>
    <div>here is some new <span class='review add' data-id='asdf'> added content</span> on a new line</div>
    <div>here is some new <span class='review del' data-id='fdsa'> deleted content</span> on a new line</div>
    <p />
    <div>123456789</div>
    <div>mor content on a new line</div>`;

    componentDidMount() {
        let editor = this.ref.current;
        editor.addEventListener('mouseup', this.textHighlighted);
        editor.addEventListener('keydown', this.onKeyDown);
        editor.addEventListener('keyup', this.onKeyUp);
        //editor.addEventListener('input', this.onInupt);

    }

    onKeyDown(e) {
        let selection = window.getSelection();
        let range = selection.getRangeAt(0);

        if (e.keyCode === 46) { //delete
            if (selection.anchorOffset < selection.focusOffset) { //text is highlighted
                this.deleteHighlightedText(selection, range);
            } else { //delete with nothing highlighted
                e.preventDefault();
            }
        } else if (isCharacterKey(e)) { //add
            if (this.isReviewNode(selection)) return; //updates handled onKeyUp
            e.preventDefault();

            let newNode = this.createReviewNode('add', e.key);
            range.insertNode(newNode);
            selection.collapse(newNode, 1);
        }
    }

    onKeyUp(e) {
        if (!isCharacterKey(e)) return;
        let selection = window.getSelection();
        this.updateReviewNode(selection.focusNode.parentElement.getAttribute('data-id'), selection.focusNode.data);
    }

    deleteHighlightedText(selection, range) {
        let newNode = this.createReviewNode('del', selection.toString());
        range.insertNode(newNode);
        range.setStartAfter(newNode);
        // We may want to delete the highlighted text manually here so that we can still e.preventDefault() after this returns.
        //  The use case for this would be replacing text by highlighting then start typeing.
    }

    updateReviewNode(id, contents) {
        let review = { id, contents };
        this.props.updateReviewHandler(review);
    }

    createReviewNode(type, contents) {
        let review = { id: uuid.v4(), contents, type };
        //console.log(review);
        let newNode = document.createElement('span');
        newNode.appendChild(document.createTextNode(contents));
        newNode.classList.add('review');
        newNode.classList.add(type);
        newNode.setAttribute('data-id', review.id);
        this.props.addReviewHandler(review);
        return newNode;
    }

    isReviewNode(selection) {
        let result = (selection.focusNode.classList && selection.focusNode.classList.contains('review'))
            || selection.focusNode.parentNode.classList.contains('review');
        //console.log(selection, selection.focusNode.classList, selection.focusNode.parentNode.classList);
        return result;
    }

    textHighlighted(e) {
        //console.log(document.getSelection());
        // let t = (document.all) ? document.selection.createRange().text : document.getSelection();
    }

    render() {
        return <div
            ref={this.ref}
            className="editor"
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: this.preloadedContent }}></div>
    }
}

function isCharacterKey(e) {
    var isWordCharacter = e.key.length === 1;
    var isBackspaceOrDelete = (e.keyCode === 8 || e.keyCode === 46);

    return isWordCharacter && !isBackspaceOrDelete && !(e.altKey || e.ctrlKey || e.metaKey);
}

export default Editor;

