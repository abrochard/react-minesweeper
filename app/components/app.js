import React, { Component } from 'react';
import Grid from './grid';

class App extends Component {
  constructor(props) {
    super(props);

    this.x = 20;
    this.y = 20;
    this.bombs = 10;

    this.state = {};
  }

  render() {
    return (
      <div>
        <Grid x={this.x} y={this.y} bombs={this.bombs}/>
        <div className="legend">{this.x} x {this.y} grid with {this.bombs} bombs</div>
      </div>
    );
  }
}

export default App;
