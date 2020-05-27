import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import PlayingCard from './Playingcard';

const FEATURES = {
//              blue        red        green
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
              'clicked': false
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
    }
    
    this.handleClick = this.handleClick.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.checkSet = this.checkSet.bind(this);

  }
  
  handleClick(idx) {
    
    this.setState((state) => {
        let deck = [...this.state.curr_deck]
        if(!(state.clicked.includes(idx)) && state.clicked.length<3){
            let clicked = [...state.clicked, idx]
            deck[idx].clicked = true
            return { clicked: clicked,
                curr_pile: deck,
                pile: state.pile};
        }
        else {
            deck[idx].clicked = false
            let clicked = [...state.clicked]
            let index = clicked.indexOf(idx)
            if (index!== -1){
                clicked.splice(index, 1)
            }
            return { clicked: clicked,
                curr_pile: deck};
        }
    });

  }

  componentDidUpdate() {
    // Check for Set
    if(this.state.clicked.length === 3) {
      this.checkSet();
    }
  }

  checkSet() {let cards = []
    for(let i = 0; i < 4; i++){
        cards.push(this.state.curr_pile[this.state.clicked[i]])
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
            console.log(`Failed when checking ${feature}`);
            console.log(cards[0][feature]);
            console.log(cards[1][feature]);
            console.log(cards[2][feature]);
            return;
        }
    }

    console.log('valid set')

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
      }
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
        clicked={curr_card.clicked}
        key={i}
        onClick={() => this.handleClick(i)}
      />
      )
      
    }
    
    render() {
      return (
        <div>
          <Jumbotron>

            <Container>
                <Row>
                  <Col lg={true}>
                    {this.renderCard(0)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(1)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(2)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(3)}
                  </Col>
                </Row>
        
                <Row>
                  <Col lg={true}>
                    {this.renderCard(4)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(5)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(6)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(7)}
                  </Col>
                </Row>

                <Row>
                  <Col lg={true}>
                    {this.renderCard(8)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(9)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(10)}
                  </Col>
                  <Col lg={true}>
                    {this.renderCard(11)}
                  </Col>
                </Row>
              </Container>

            </Jumbotron>

            <p>Remaining cards: {this.state.pile.length}</p>
            <p>Sets found so far: {this.state.score}</p>
      </div>
    )
  }
}

export default App;