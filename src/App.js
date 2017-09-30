import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

const COLORS = [ 'purple', 'aqua', 'navajowhite', 'peachpuff', 'burlywood', 'chuck norris', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral']
const GRAMMAR = '#JSGF V1.0; grammar colors; public <color> = ' + COLORS.join(' | ') + ' ;'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Listener phrases={COLORS} grammar={GRAMMAR} render={(state, resetState) => {
          return (
            <div className="App-content">
              {state.phrase &&
                <div>
                  <pre> {JSON.stringify(state)} </pre>
                  <div id="advanced" className="circle" style={{backgroundColor: state.phrase.split(' ').join('')}}/>
                  <button onClick={() => resetState()}> THAT WAS AWESOME LETS GO AGAIN </button>
                </div>
              }
              {!state.phrase && 
                <p> say one of the following colors: <code>{JSON.stringify(COLORS)}</code> </p>
              }
            </div>
          )
        }}/>
      </div>
    );
  }
}

class Listener extends Component {
  constructor(props) {
    super(props)
    this.state = {
      diagnostic: '',
      phrase: ''
    }
    this.resetState = this.resetState.bind(this)
  }
  state = {}
  componentDidMount() {
    this.recognition = new window.webkitSpeechRecognition()
    this.speechRecognitionList = new window.webkitSpeechGrammarList()
    this.speechRecognitionList.addFromString(this.props.GRAMMAR, 1)
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.start();
    this.recognition.onresult = (e) => this.handleInput(e)
    this.recognition.onspeechend = this.recognition.stop()
    console.log('Ready to receive a color command.')
  }

  handleInput(e) {
    const last = e.results.length - 1
    const phrase = e.results[last][0].transcript
    this.setState({
      diagnostic: 'Result received: ' + phrase + '.',
      phrase: phrase
    })
    console.log('Confidence: ' + e.results[0][0].confidence)
  }

  resetState() {
    this.setState({
      diagnostic: '',
      phrase: ''
    });
  }

  render() {
    return (
      this.props.render(this.state, this.resetState)
    )
  }
}




export default App;


