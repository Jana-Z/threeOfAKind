import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlayingCard from './Playingcard';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

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
        status: 'secondary'},
    }
    
    this.cardInFocus = this.cardInFocus.bind(this);
    this.cardLostFocus = this.cardLostFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.checkSet = this.checkSet.bind(this);
    this.addCards = this.addCards.bind(this);

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

  addCards(x) {

  this.setState((state) => {
      let deck = [...state.curr_deck];
      let pile = [...state.pile];
      for(let i = 0; i < x ; i ++){
        deck.push(pile.pop());
      }
      return {
        curr_deck: deck,
        pile: pile,
      }
    })

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

    // valid set
    this.setState((state) => {
      let deck = [...state.curr_deck];
      let pile = [...state.pile];
      if(deck.length === 12){
        for(const setCard of state.clicked){
          deck[setCard] = pile.pop();
        }
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
      }
      else {
        deck = deck.filter((card, idx) => !(state.clicked.includes(idx)))
        console.log(deck)
        return {
          clicked: [],
          curr_deck: deck,
          score: state.score + 1,
          heading: {
            message: 'That was a valid set',
            status: 'success',
          }
        };
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
      alignItems: 'center',

    }
    return (
      <div style={{backgroundColor: '#e9ecef', padding: '1em'}}>
          <Container fluid>
            <Alert variant={this.state.heading.status}>
              <Alert.Heading>{this.state.heading.message}</Alert.Heading>
              <p>Remaining cards: {this.state.pile.length} <br />
                Sets found so far: {this.state.score}</p>
                <div className="d-flex justify-content-end">
                  <Button onClick={() => this.addCards(3)} variant={`outline-${this.state.heading.status}`}>
                    Get three more cards
                  </Button>
                </div>
            </Alert>

              <Row xs={2} md={3} lg={4}>
                {this.state.curr_deck.map((card, idx) => 
                    <Col style={colStyle} key={idx}>
                      {this.renderCard(idx)}
                    </Col>
                )}
              </Row>
    
            </Container>
    </div>
  )
  }
}

export default App;