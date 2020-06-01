import React from 'react';

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
        let background = this.props.inFocus ? "#c9d3f2" : "white";
        let main_style = {
            backgroundColor: background,
            margin: '0.5em',
            cursor: 'pointer',
            borderRadius: '5px',  // round edges
            height: '10.5em',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        }
        let shapes = []
        for(let i=0; i<this.props.amount; i++){
            shapes.push([this.props.color, this.props.filling, this.props.shape])
        }
        return (
            <div
                style={main_style}
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}>

                {shapes.map((s, i) => {
                    return (
                        <div key={i}>
                            {this.drawOne(...s)}
                        </div>
                    )
                })}

            </div>
        )
    }
  }

  export default PlayingCard