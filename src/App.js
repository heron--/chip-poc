import React, { Component } from 'react';
import classNames from 'classnames';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.noteCount = 32;
    this.bpm = 140;
    this.noteLength = 100;
    this.setNote = this.setNote.bind(this);
    this.step = this.step.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this.state = {
      playing: false,
      notes: [
        {
          id: '00',
          name: '3 - G',
          frequency: 196,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '01',
          name: '3 - G♯',
          frequency: 207.65,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '02',
          name: '3 - A',
          frequency: 220,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '03',
          name: '3 - A♯',
          frequency: 233.08,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '04',
          name: '3 - B',
          frequency: 246.94,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '05',
          name: '4 - C',
          frequency: 261.63,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '06',
          name: '4 - C♯',
          frequency: 277.18,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '07',
          name: '4 - D',
          frequency: 293.66,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '08',
          name: '4 - D♯',
          frequency: 311.13,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '09',
          name: '4 - E',
          frequency: 329.63,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '10',
          name: '4 - F',
          frequency: 349.23,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '11',
          name: '4 - F♯',
          frequency: 369.99,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '12',
          name: '4 - G',
          frequency: 392,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '13',
          name: '4 - G♯',
          frequency: 415.3,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '14',
          name: '4 - A',
          frequency: 440,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '15',
          name: '4 - A♯',
          frequency: 466.16,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '16',
          name: '4 - B',
          frequency: 493.88,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
        {
          id: '17',
          name: '5 - C',
          frequency: 523.25,
          lane: Array.apply(null, Array(this.noteCount)).map((_) => false)
        },
      ],
      currentNote: 0
    }

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  componentWillMount() {
    window.requestAnimationFrame(() => {
      this.lastStep = window.Date.now();
      this.step();
    })
  }

  play() {
    this.setState({
      playing: true
    });
  }

  pause() {
    this.setState({
      playing: false
    });
  }

  setNote(laneId, idx, status) {

    const newNotes = this.state.notes.map((noteLane, i) => {
      return noteLane.id === laneId ? Object.assign({}, noteLane, {
        lane: noteLane.lane.map((note, j) => j === idx ? status : note) 
      }) : noteLane;
    });

    this.setState({
      notes: newNotes
    });
  }

  step() {

    const timeIncrement = (60 / (this.bpm * 4)) * 1000; // milliseconds

    if(window.Date.now() < this.lastStep + timeIncrement || !this.state.playing) {

      window.requestAnimationFrame(this.step);

    } else {

      const nextNote = this.state.currentNote < this.noteCount - 1 ? this.state.currentNote + 1 : 0;

      this.setState({
        currentNote: nextNote
      });

      this.lastStep = window.Date.now();

      window.requestAnimationFrame(this.step);
    }

  }

  render() {

    const playClasses = classNames({
      'button-control': true,
      'button-control--play': true,
      'button-control--active': this.state.playing
    });

    const pauseClasses = classNames({
      'button-control': true,
      'button-control--pause': true,
      'button-control--active': !this.state.playing
    })

    return (
      <div className="App">
        <h2>Music Demo</h2>
        <div className="controls">
          <div className={ playClasses } onClick={() => { this.play(); } }>Play</div>
          <div className={ pauseClasses } onClick={() => { this.pause(); } }>Pause</div>
        </div>
        <div className="lane-container">
          {
            this.state.notes.map((noteLane, i) => {
              return (
                <NoteLane
                  key={ i }
                  position={ i }
                  id={ noteLane.id }
                  lane={ noteLane.lane }
                  frequency={ noteLane.frequency }
                  name={ noteLane.name }
                  audioContext={ this.audioContext }
                  currentNote={ this.state.currentNote }
                  noteLength={ this.noteLength }
                  setNote={ this.setNote }
                  playing={ this.state.playing }
                />
              );
            })
          } 
        </div>
      </div>
    );
  }
}

class NoteLane extends Component {

  constructor(props) {
    super(props);

    const {
      audioContext,
      frequency
    } = props;

    this.volumeValue = 0.1;

    this.oscillator = audioContext.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = frequency;

    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = 0;

    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(audioContext.destination);

    this.oscillator.start();
  }

  componentWillMount() {


  }

  componentWillReceiveProps(nextProps) {

    const {
      lane,
      currentNote
    } = nextProps

    const {
      // audioContext,
      noteLength,
      playing
    } = this.props;

    if(lane[currentNote] && playing) {

      // this.oscillator.connect(audioContext.destination);

      this.gainNode.gain.value = this.volumeValue;

      setTimeout(() => {
        try {

          // this.oscillator.disconnect(audioContext.destination);
          this.gainNode.gain.value = 0;

        } catch(e) {

          console.log(e.message);
          
        }
      }, noteLength)
    }

  }

  render() {

    const {
      id,
      lane,
      currentNote,
      setNote,
      name
    } = this.props;

    return (
      <div className="note-lane">
        <div className="note-lane-label">{ name }</div>
        <div className="note-container">
          {
            lane.map((note, i) => {
              return (
                <Note
                  key={ i }
                  position={ i }
                  active={ note }
                  currentNote={ currentNote }
                  setNote={ setNote }
                  laneId={ id }
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

const Note = ({
  active,
  currentNote,
  position,
  laneId,
  setNote
}) => {

  const noteClasses = classNames({
    'note': true,
    'note--active': active,
    'note--current': currentNote === position,
    'note--first': position % 4 === 0 
  })

  return <div className={ noteClasses } onClick={ () => { setNote(laneId, position, !active) } }></div>
};

export default App;
