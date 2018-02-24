import React, { Component } from 'react';

// turn to true if you want to see bomb location
const DEBUG = false;

class Cell extends Component {
  constructor(props) {
    super(props);

    this.x = props.x;
    this.y = props.y;
    this.bomb = props.bomb;
    this.click = props.click;
    this.flag = props.flag;

    this.state = {};
  }

  onClick() {
    if (this.props.clicked || this.props.flagged) {
    // can't click again
      return;
    }

    this.click();
  }

  onRightClick(e) {
    e.preventDefault();
    if (this.props.clicked) {
      // can't flag if clicked
      return;
    }

    this.flag();
  }

  render() {
    var className = "cell";
    if (this.bomb && DEBUG) {
      className += " trapped";
    }
    if (this.props.clicked) {
      className += " clicked";
    }

    var flag = this.props.flagged ? <i className="fa fa-flag" style={{color: 'red'}}></i> : '';
    var bomb = this.props.clicked && this.bomb ? <i className="fa fa-bomb" aria-hidden="true"></i> : '';

    return (
      <div className={className}
           onClick={this.onClick.bind(this)}
           onContextMenu={this.onRightClick.bind(this)}>
        {flag}
        {bomb}
        {this.props.count}
      </div>
    );
  }
}

export default Cell;
