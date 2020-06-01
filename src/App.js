import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import PlayingCard from './Playingcard';
import Alert from 'react-bootstrap/Alert';

const FEATURES = {
//             blue        red        green
    'color': ['#48b0ba', '#ba5d48', '#48ba5f'],
    'shape': ['circle', 'square', 'swoosh'],
    'filling': ['full', 'none', 'mottled'],
    'amount': [1, 2, 3]
}


class App extends React.Component{
  
  constructor(props) {
    super(props);
    
    var pile = []
    
    for (const color of FEATURES.color) {
      for (const shape of FEATURES.shape) {
        for (const filling of FEATURES.filling) {
          for (const amount of FEATURES.amount){
            pile.push({
              'color': color,
              'shape': shape,
              'filling': filling,
              'amount': amount,
              'inFocus': false
            });
          }
        }
      }
    }
    
    // Shuffle pile
    let ctr = pile.length;
    let temp;
    let index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = pile[ctr];
      pile[ctr] = pile[index];
      pile[index] = temp;
    }
    
    var curr_deck = pile.slice(0, 12)
    
    this.state =  {
      pile: pile,
      curr_deck: curr_deck,
      score: 0,
      clicked: [],
      heading: {
        message: 'Find a set',
        status: 'light'},
    }
    
    this.cardInFocus = this.cardInFocus.bind(this);
    this.cardLostFocus = this.cardLostFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.checkSet = this.checkSet.bind(this);

  }
  
  handleClick(idx) {
    
    this.setState((state) => {
        let deck = [...this.state.curr_deck]
        if (state.clicked.length === 3) {
          for (const card of deck) {
            card.inFocus = false;
          }
          deck[idx].inFocus = true;
          return {
            clicked: [idx],
            curr_deck: deck, 
          };
        }
        else if(!(state.clicked.includes(idx)) && state.clicked.length < 3){
            let clicked = [...state.clicked, idx]
            deck[idx].inFocus = true
            return {
              clicked: clicked,
              curr_deck: deck
            };
        }
        else {
            deck[idx].inFocus = false
            let clicked = [...state.clicked]
            let index = clicked.indexOf(idx)
            if (index!== -1){
                clicked.splice(index, 1)
            }
            return {
              clicked: clicked,
              curr_deck: deck
            };
        }
    });

  }

  componentDidUpdate(prevProps, prevState) {
    // Check for Set
    if(this.state.clicked.length === 3 && this.state.clicked !== prevState.clicked) {
      this.checkSet();
    }
  }

  checkSet() {
    
    let cards = []
    for(let i = 0; i < 4; i++){
        cards.push(this.state.curr_deck[this.state.clicked[i]])
    }
    for (const feature in FEATURES) {
        let valid = false
        // Not all the same
        if(cards[0][feature] === cards[1][feature] && cards[1][feature] === cards[2][feature]) {
            valid = true
        }
        // Not all different
        if(cards[0][feature] !== cards[1][feature] && cards[0][feature] !== cards[2][feature] && cards[1][feature] !== cards[2][feature]){
            valid = true
        }
        if(!valid){
            this.setState({
                heading: {
                  message: `Failed when checking the ${feature}`,
                  status: 'danger',
                }
              });
            return;
        }
    }

    this.setState((state) => {
      let deck = [...state.curr_deck];
      let pile = [...state.pile];
      for(const setCard of this.state.clicked){
        deck[setCard] = pile.pop();
      }
      console.log(deck, pile)
      return {
        curr_deck: deck,
        pile: pile,
        clicked: [],
        score: state.score + 1,
        heading: {
          message: 'That was a valid set',
          status: 'success',
        }
      }
    });
  }

  cardInFocus(idx) {

    this.setState((state) => {
      let deck = [...state.curr_deck];
      deck[idx].inFocus = true;
      return {
        curr_deck: deck,
      };
    });

  }

  cardLostFocus(idx) {

  this.setState((state) => {
    let deck = [...state.curr_deck];
    deck[idx].inFocus = state.clicked.indexOf(idx) !== -1  ? true : false;
    return {
      curr_deck: deck,
    };
  });

  }
  
  renderCard(i) {
    
    let curr_card = this.state.curr_deck[i]

    return (
      <PlayingCard
        color={curr_card.color}
        amount={curr_card.amount}
        filling={curr_card.filling}
        shape={curr_card.shape}
        inFocus={curr_card.inFocus}
        key={i}
        onClick={() => this.handleClick(i)}
        onMouseEnter={() => this.cardInFocus(i)}
        onMouseLeave={() => this.cardLostFocus(i)}
      />
      )
      
    }
    
    render() {
      let colStyle = {
        height: 'auto',
      }
      return (
        <div>
          <Jumbotron>
            <Container>
          <Alert variant={this.state.heading.status}>
            <p>{this.state.heading.message}</p>
            <p>Remaining cards: {this.state.pile.length} <br />
              Sets found so far: {this.state.score}</p>
          </Alert>
                <Row>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(0)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(1)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(2)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(3)}
                  </Col>
                </Row>
        
                <Row>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(4)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(5)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(6)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(7)}
                  </Col>
                </Row>

                <Row>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(8)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(9)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(10)}
                  </Col>
                  <Col lg={true} style={colStyle}>
                    {this.renderCard(11)}
                  </Col>
                </Row>
              </Container>
            </Jumbotron>
      </div>
    )
  }
}

export default App;