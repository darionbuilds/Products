import React from 'react';

import Ratings from './ratings';
import ReviewList from './reviewList';


class Reviews extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      reviews: null,
      meta: null,
      sort: 'relevant',
      page: 1,
      count: 2,
      id: this.props.id
    };
  }

  moreReviewsHandler(e){
    this.setState({page: ++this.state.page},
      this.getReviews(result => {
        let currReviews = Array.from(this.state.reviews.results);
        currReviews = currReviews.concat(result.results);
        if(result.results.length === 0) {
          e.target.style.display = 'none';
        }
        this.setState({reviews: {results: currReviews}});
      }));
  }

  getReviews(next) {
    fetch(`http://localhost:3001/api/reviews/reviewPage/${this.state.id}/${this.state.page}/${this.state.count}/${this.state.sort}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(result => {
        next(result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  sortReviewsHandler(sortOption) {
    //once called duplicates are rendered
    this.setState({reviews: null},
      this.setState({page: 1},
        this.setState({sort: sortOption}, ()=>{
          this.getReviews(res=>{
            console.log(res);
            this.setState({reviews: res});
          });
        })));
  }

  componentDidMount(){
    this.getReviews((res)=>{
      this.setState({reviews: res});
    });
    //refactor code to pull from app state instead of this redundant server call
    fetch(`http://localhost:3001/api/reviews/meta/${this.state.id}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(result => {
        this.setState({meta: result});
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render(){
    return (
      <div className="reviews container">
        <h2>Ratings &amp; Reviews</h2>
        <div style={{display: 'flex'}}>
          {this.state.meta? <Ratings ratings={this.state.meta}/>: null}
          {this.state.reviews && this.state.meta?
            <ReviewList sortHandler={this.sortReviewsHandler.bind(this)} moreReviewsHandler={this.moreReviewsHandler.bind(this)} reviews={this.state.reviews} recommended={this.state.meta.recommended} />:
            null}
        </div>
      </div>
    );
  }
}

export default Reviews;