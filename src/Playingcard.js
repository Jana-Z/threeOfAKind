import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

// const FEATURES = {
//     //              blue        red        green
//         'color': ['#48b0ba', '#ba5d48', '#48ba5f'],
//         'shape': ['circle', 'square', 'swoosh'],
//         'filling': ['full', 'none', 'mottled'],
//         'amount': [1, 2, 3]
//     }

class PlayingCard extends React.Component{
    constructor(props) {
      super(props);

      this.drawOne = this.drawOne.bind(this);
    }

    drawOne(color, filling, shape) {
        let fillStyle = "transparent";
        let strokeStyle = "transparent";
        let strokeWidth = "3";
        let defs = (
            <defs>
                <pattern id={`mottled-${color}`}  width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="2" height="4"fill={color} />
                </pattern>
            </defs>
        );

        switch (filling) {
            case 'full':
                fillStyle = color;
                break;
            case 'none':
                strokeStyle = color;
                break;
            case 'mottled':
                fillStyle = `url(#mottled-${color})`;
                strokeStyle = color;
                strokeWidth = "2";
                break;
            default:
                break;
        }

        switch (shape) {
            case 'square':
                return (
                    <svg width= "100" height="50">
        
                        {fillStyle === `url(#mottled-${color})` ? defs : null}      
        
                        <rect 
                            fill={fillStyle}
                            stroke={strokeStyle}
                            strokeWidth={strokeWidth}
                            x="0" y="0" width="100" height="45"
                        />
                    </svg>
                )
            case 'circle':
                return (
                    <svg width= "100" height="50">
        
                    {fillStyle === `url(#mottled-${color})` ? defs : null}  
        
                        <ellipse 
                            fill={fillStyle}
                            stroke={strokeStyle}
                            strokeWidth={strokeWidth}
                            cx="50" cy="25"
                            rx="47" ry="22"
                        />
                    </svg>
                )
            case 'swoosh':
                return (
                    <svg width= "100" height="50">
        
                        {defs}

                        <polygon points="0,50 30,12 70,38 100,0"
                            fill={fillStyle}
                            stroke={strokeStyle}
                            strokeWidth={strokeWidth}
                        />
                    </svg>
                )
        }
    }

    render() {
        // Styling
        let background = this.props.clicked ? "#c9d3f2" : "white";
        let main_style = {
            padding: '1em',
            backgroundColor: background,
            height: '90%',
            width: '100%',
            margin: '0.5em',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '5px',
        }
        let shapes = []
        for(let i=0; i<this.props.amount; i++){
            shapes.push([this.props.color, this.props.filling, this.props.shape])
        }
        return (
            <div style={main_style}
                onClick={this.props.onClick}>
                <Col
                    style={{
                        margin: 'auto'
                    }}>

                    {shapes.map(s => {
                        return (
                        <Row>
                            {this.drawOne(...s)}
                        </Row> )
                    })}

                </Col>
            </div>
        )
    }
  }

  export default PlayingCard