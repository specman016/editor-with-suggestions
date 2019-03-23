import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Editor from './Editor';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewItems: [
        { id: 'asdf', contents: 'added content', type: 'add' },
        { id: 'fdsa', contents: 'deleted content', type: 'del' }]
    };

    this.addReviewHandler = this.addReviewHandler.bind(this);
    this.updateReviewHandler = this.updateReviewHandler.bind(this);
  }

  addReviewHandler(review) {
    var joined = [...this.state.reviewItems, review];
    this.setState({ reviewItems: joined })
  }

  updateReviewHandler(updated) {
    let copy = [...this.state.reviewItems];
    let match = copy.find(review => {
      return review.id === updated.id;
    });
    match.contents = updated.contents;
    this.setState({ reviewItems: copy })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" width="100px" />
        </header>
        <Editor addReviewHandler={this.addReviewHandler} updateReviewHandler={this.updateReviewHandler} />
        <div className="review-items">
          <h3>Review Items</h3>
          {this.state.reviewItems.map(review => {
            return <div className={`review-item ${review.type}`} data-id={review.id} key={review.id}>
              <div>{review.type}</div>
              {review.contents}
            </div>;
          })}</div>
      </div>
    );
  }
}

export default App;
