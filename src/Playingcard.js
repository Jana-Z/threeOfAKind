import React from 'react';


// this.props = {
//     color: '',
//     filling: '', 
//     amount: '', 
//     shape: ''
// }

class PlayingCard extends React.Component{
    // constructor(props) {
    //   super(props);
    // }
    render() {
        // Styling
        let background = this.props.color
        let opacity = this.props.clicked ? 0.5 : 1.0;
        let main_style = {
            padding: '1em',
            msTransform: "translate(-50%, -50%)",
            backgroundColor: background,
            borderRadius: '5px',
            opacity: opacity,
            width: '100%',
            height: '100%',
            margin: '1em'
        }
        let shapes = this.props.filling
        for(let i=0; i < this.props.amount; i++){
            shapes = shapes + ' ' + this.props.shape
        }
        return (
            <button style={main_style}
                onClick={this.props.onClick}>
                    {shapes}
            </button>
        )
    }
  }

  export default PlayingCard