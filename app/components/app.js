import React, { Component } from 'react';
import Grid from './grid';

class App extends Component {
  constructor(props) {
    super(props);

    this.x = 16;
    this.y = 30;
    this.bombs = 99;

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
