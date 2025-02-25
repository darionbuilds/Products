import React from 'react';
import Overview from './components/overview';
import QuestionsAndAnswers from './components/questions';
import Related from './components/related';
import Reviews from './components/reviews';
import Modal from './utils/modal';
import AppContext from './appContext.js';
import axios from 'axios';
import styled, {ThemeProvider} from 'styled-components';
import Loader from './utils/loader';

const windowPath = window.location.href;

const lightTheme = {
  background: 'white',
  mainFont: '#424141',
};

const darkTheme = {
  background: '#191919',
  mainFont: '#bfbfbf',
};

const AppContainer = styled.div`
  background: ${props=>props.theme.background};
  color: ${props=>props.theme.mainFont};
  padding: 2rem 0
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
      modal: {
        modalShown: false,
        modalContent: null,
        product: null
      },
      characterDescriptions: {
        Size:[ 'A size too small', '½ a size too small', 'Perfect', '½ a size too big', 'A size too wide'],
        Width: [ 'Too narrow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'],
        Comfort: [ 'Uncomfortable', 'Slightly uncomfortable', 'Ok', 'Comfortable', 'Perfect'],
        Quality: [ 'Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect'],
        Length: [ 'Runs Short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'],
        Fit: [ 'Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs long']
      },
      loading: false
    };
  }

  componentDidMount() {
    axios.get(`${windowPath}api/reviews/chars?product_id=17070`)
      .then(res => {
        console.log(res);
        this.setState({
          product: res.data
        });
      })
      .catch(err => {
        console.log('failed to fetch data', err);
      });
  }

  logInteraction(e) {
    let widget = e.target.closest('.widget').id;
    let element = e.target.localName;
    e.target.className ? element += ' ' + e.target.className : null;
    e.target.id ? element += ' ' + e.target.id : null;
    let data = {
      element: element,
      date: new Date().toString(),
      widget: widget
    };

    axios.post(`${windowPath}api/interaction`, data)
      .then(() => {
        console.log('posted successfully');
      })
      .catch(err => {
        console.log('failed to post', err);
      });
  }

  closeModal() {
    this.setState({
      modal:{
        modalShown: false,
        modalContent: null
      }
    });
  }

  openModal(content){
    this.setState({
      modal:{
        modalShown: true,
        modalContent: content
      }
    });
  }

  handleProductChange(id) {
    if (id === 17076) {
      alert('You\'ve found an easter egg!');
    } else {
      this.setState({loading: true});
      axios.get(`${windowPath}api/reviews/chars?product_id=${id}`)
        .then(res => {
          this.setState({
            product: res.data,
            loading: false
          });
        })
        .catch(err => {
          console.log('failed to fetch data', err);
        });
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.state.darkMode? darkTheme: lightTheme}>
        <AppContainer>
          <AppContext.Provider value={{openModal: this.openModal.bind(this),
            characteristicsChart: this.state.product ? this.state.product.characteristics : null,
            product: this.state.product ? this.state.product : null,
            characterDescriptions: this.state.characterDescriptions}}>
            {
              (this.state.modal.modalShown && this.state.modal.modalContent)?
                <Modal modalContent={this.state.modal.modalContent} close={this.closeModal.bind(this)}/>:
                null
            }
            <button
              className = 'clickMe'
              style = {{
                float: 'right'
              }}
              onClick={()=>{this.setState({darkMode: !this.state.darkMode})}}
            >Change Theme</button>
            {/* <Overview /> */}
            {
              this.state.product ?
                <Related loading = {this.state.loading} handleProductChange = {this.handleProductChange.bind(this)}/> : <Loader />
            }
            {/* <div style = {{margin: '0 40%', fontSize: '3.5em'}}>Loading Please Wait...</div> */}
            {/* <QuestionsAndAnswers /> */}
            {
              this.state.product?
                <Reviews id={this.state.product.id}/>: null
            }
          </AppContext.Provider>
        </AppContainer>
      </ThemeProvider>
    );
  }
}

export default App;