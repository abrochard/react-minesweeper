import React, { Component } from 'react';
import Cell from './cell';
import RandomGenerator from '../utils/random_generator';


class Grid extends Component {
  constructor(props) {
    super(props);

    this.x = props.x;
    this.y = props.y;
    this.bombs = props.bombs;
    this.correctFlags = 0;

    var overlay = '';
    var cells = [];

    // get the generator ready
    var totalCells = this.x * this.y;
    var generator = new RandomGenerator(totalCells, this.bombs);

    // setup the cells
    for (var i = 0; i < this.x; i++) {
      cells.push([]);
      for (var j = 0; j < this.y; j++) {
        cells[i][j] = {
          x: i,
          y: j,
          clicked: false,
          flagged: false,
          bomb: generator.get(),
          click: this.setClicked(i, j).bind(this),
          flag: this.setFlagged(i, j).bind(this)
        };
      }
    }

    this.state = {cells, overlay};
  }

  inBounds(x, y) {
    // Helper function to see if x, y are valid coordinates
    if (x >= 0 && x < this.x && y >= 0 && y < this.y) {
      return true;
    }
    return false;
  }

  updateCell(i, j, fct) {
    // update cell in state and force re-rendering
    // fct is given a cell and must return a cell
    if (this.inBounds(i, j)) {
      var cells = this.state.cells;
      cells[i][j] = fct(cells[i][j]);
      this.setState({cells});
    }
  }

  onCellClicked(i, j) {
    this.updateCell(i, j, cell => {
      // set the cell as clicked
      cell.clicked = true;

      // check for bomb
      if (cell.bomb) {
        this.setState({overlay: 'Game Over'});
        return cell;
      }

      var count = this.getCount(i, j);

      if (count == 0) {
        // we need to propagate to neighbors
        cell.count = '';
        this.propagate(i, j);
      } else {
        cell.count = count;
      }

      return cell;
    });
  }

  setClicked(i, j) {
    return function() {
      this.onCellClicked(i, j);
    };
  }

  setFlagged(i, j) {
    return function() {
      this.updateCell(i, j, cell => {
        // flag or unflag
        cell.flagged = !cell.flagged;

        if (cell.bomb && cell.flagged) {
          // this is a step in the right direction
          this.correctFlags++;

          if (this.correctFlags == this.bombs) {
            this.setState({overlay: 'You Win'});
          }
        } else if (cell.bomb && !cell.flagged) {
          // this is a step backward
          this.correctFlags--;
        }

        return cell;
      });
    };
  }

  setCount(i, j, count) {
    this.updateCell(i, j, cell => {
      cell.count = count;
      return cell;
    });
  }

  getCount(i, j) {
    return this.getNeighbors(i, j).filter(el => {
      return el.bomb;
    }).length;
  }

  getNeighbors(i, j) {
    // get all neighboring cells
    var coord = [
      {x: i-1, y: j},
      {x: i+1, y: j},
      {x: i, y: j-1},
      {x: i, y: j+1},
      {x: i-1, y: j-1},
      {x: i-1, y: j+1},
      {x: i+1, y: j-1},
      {x: i+1, y: j+1},
    ];

    return coord.map(el => {
      var {x, y} = el;
      if (this.inBounds(x, y)) {
        return this.state.cells[x][y];
      } else {
        return null;
      }
    }).filter(el => {
      return el != null;
    });
  }

  propagate(i, j) {
    // for each neighbor
    this.getNeighbors(i, j).forEach(c => {
      var {x, y} = c;
      if (!c.clicked && !c.flagged) {
        var count = this.getCount(x, y);
        if (count == 0) {
          // trigger a click
          this.onCellClicked(x, y);
        } else {
          // show the count
          this.setCount(x, y, count);
        }
      }
    });
  }

  render() {
    // render rows
    var rows = this.state.cells.map((row, i) => {
      var r = row.map((el, j) => {
        return (
          <td key={j}>
            <Cell {...el}/>
          </td>
        );
      });
      return <tr key={i}>{r}</tr>;
    });

    // render overlay
    var overlay = '';
    if (this.state.overlay != '') {
      overlay = (
        <div className="overlay">
          {this.state.overlay}
        </div>
      );
    }

    return (
      <div>
        {overlay}
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Grid;
