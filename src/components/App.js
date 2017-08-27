import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    const exchange = {
      EURRSD: 1,
      RSDEUR: 1,
      USDRSD: 1,
      RSDUSD: 1,
      EURUSD: 1,
      USDEUR: 1
    }

    this.state = {
      exchange: exchange,
      currency: ['EUR', 'RSD', 'USD'],
      first: 'EUR',
      second: 'RSD',
      firstInput: 1,
      secondInput: 1
    }
  }

  componentDidMount() {
    let time = new Date().getTime();
    const storage = JSON.parse(localStorage.getItem('currencyconvertor'))
    if(storage) {
      if(storage.time + 43200000 < time) {
        this.setState(storage.state);
      } else  {
        axios.get('http://www.apilayer.net/api/live?access_key=14b793e6c2439b574e2f1a322dc9fa0c&format=1&currencies=EUR,RSD')
          .then((res) => {
            const newStorage = {
              time: res.data.timestamp,
              state: {
                exchange: {
                  EURRSD: res.data.quotes.USDRSD / res.data.quotes.USDEUR,
                  RSDEUR: 1 / (res.data.quotes.USDRSD / res.data.quotes.USDEUR),
                  USDRSD: res.data.quotes.USDRSD,
                  RSDUSD: 1 / res.data.quotes.USDRSD,
                  EURUSD: 1 / res.data.quotes.USDEUR,
                  USDEUR: res.data.quotes.USDEUR
                },
                currency: ['EUR', 'RSD', 'USD'],
                first: storage.state.first,
                second: storage.state.second,
                firstInput: storage.state.firstInput,
                secondInput: (storage.state.firstInput * (res.data.quotes.USDRSD / res.data.quotes.USDEUR)).toFixed(2)
              }
            }
            this.setState(newStorage.state)
            localStorage.setItem('currencyconvertor', JSON.stringify(newStorage))
          })
          .catch((e) => {
            this.setState(storage.state)
          })
      }
    } else {
      console.log('proba');
      axios.get('http://www.apilayer.net/api/live?access_key=14b793e6c2439b574e2f1a322dc9fa0c&format=1&currencies=EUR,RSD')
        .then((res) => {
          console.log(res);
          const newStorage = {
            time: res.data.timestamp,
            state: {
              exchange: {
                EURRSD: res.data.quotes.USDRSD / res.data.quotes.USDEUR,
                RSDEUR: 1 / (res.data.quotes.USDRSD / res.data.quotes.USDEUR),
                USDRSD: res.data.quotes.USDRSD,
                RSDUSD: 1 / res.data.quotes.USDRSD,
                EURUSD: 1 / res.data.quotes.USDEUR,
                USDEUR: res.data.quotes.USDEUR
              },
              currency: ['EUR', 'RSD', 'USD'],
              first: 'EUR',
              second: 'RSD',
              firstInput: 1,
              firstInputError: '',
              secondInput: (res.data.quotes.USDRSD / res.data.quotes.USDEUR).toFixed(2),
              secondInputError: ''
            }
          }
          this.setState(newStorage.state)
          localStorage.setItem('currencyconvertor', JSON.stringify(newStorage))
        })
        .catch( e => console.log(e))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.first !== this.state.first) {
      this.setState({
        secondInput: (this.state.firstInput * this.state.exchange[this.state.first + this.state.second]).toFixed(2)
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state = this.state;
      storage.state.secondInput = (this.state.firstInput * this.state.exchange[this.state.first + this.state.second]).toFixed(2)
      localStorage.setItem('currencyconvertor', JSON.stringify(storage))
    } else if(prevState.second !== this.state.second) {
        this.setState({
          firstInput: (this.state.secondInput / this.state.exchange[this.state.first + this.state.second]).toFixed(2)
        })
        const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
        storage.state = this.state;
        storage.state.firstInput = (this.state.secondInput / this.state.exchange[this.state.first + this.state.second]).toFixed(2)
        localStorage.setItem('currencyconvertor', JSON.stringify(storage))
    }
  }

  onFirstChange() {
    this.setState({
      first: this.refs.first.value
    })
  }

  onSecondChange() {
      this.setState({
      second: this.refs.second.value
    })
  }

  onFirstInputChange() {
    let number = this.refs.firstInput.value * 1;
    if(this.refs.firstInput.value === '') {
      this.setState({
        firstInput: 1,
        secondInput: (this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        firstInputError: '',
        secondInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.firstInput = 1;
      storage.state.firstInputError = '';
      storage.state.secondInputError = '';
      storage.state.secondInput = (this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    } else if(isNaN(number)) {
      this.setState({
        firstInput: this.refs.firstInput.value,
        secondInput: (this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        firstInputError: 'please enter a number',
        secondInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.firstInput = this.refs.firstInput.value;
      storage.state.secondInput = (this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      storage.state.firstInputError = 'please enter a number';
      storage.state.secondInputError = '';
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    } else {
      this.setState({
        firstInput: number,
        secondInput: (number * this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        firstInputError: '',
        secondInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.firstInput = number;
      storage.state.firstInputError = '';
      storage.state.secondInputError = '';
      storage.state.secondInput = (number * this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    }
  }

  onSecondInputChange() {
    let number = this.refs.secondInput.value * 1;
    if(this.refs.secondInput.value === '') {
      this.setState({
        secondInput: 1,
        firstInput: (1 / this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        secondInputError: '',
        firstInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.secondInput = 1;
      storage.state.secondInputError = '';
      storage.state.firstInputError = '';
      storage.state.firstInput = (1 / this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    } else if(isNaN(number)) {
      this.setState({
        secondInput: this.refs.secondInput.value,
        firstInput: (1 / this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        secondInputError: 'please enter a number',
        firstInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.secondInput = this.refs.secondInput.value;
      storage.state.secondInputError = 'please enter a number';
      storage.state.firstInputError = '';
      storage.state.firstInput = (1 / this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    } else {
      this.setState({
        secondInput: number,
        firstInput: (number / this.state.exchange[this.state.first + this.state.second]).toFixed(2),
        secondInputError: '',
        firstInputError: ''
      })
      const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
      storage.state.secondInput = number;
      storage.state.secondInputError = '';
      storage.state.firstInputError = '';
      storage.state.firstInput = (number / this.state.exchange[this.state.first + this.state.second]).toFixed(2);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    }
  }

  onSwapClick() {
    if(this.state.firstInputError) {
      let si = this.state.secondInput;
      let f = this.state.first;
      let s = this.state.second;
      this.setState({
        firstInput: si,
        firstInputError: '',
        secondInputError: '',
        first: s,
        second: f
      })
    } else if(this.state.secondInputError) {
      let fi = this.state.firstInput;
      let f = this.state.first;
      let s = this.state.second;
      this.setState({
        secondInput: fi,
        second: f,
        first: s,
        firstInputError: '',
        secondInputError: ''
      })
    } else {
      let f = this.state.first;
      let s = this.state.second;
      let fi = this.state.firstInput;
      let si = this.state.secondInput;
      this.setState({
        first: s,
        second: f,
        firstInput: si,
        secondInput: fi,
        firstInputError: '',
        secondInputError: ''
        });
    }

  }

  onResetButtonClick() {
    this.setState({
      first: 'EUR',
      second: 'RSD',
      firstInput: 1,
      secondInputError: '',
      firstInputError: '',
      secondInput: (this.state.exchange['EURRSD']).toFixed(2)
    })
    const storage = JSON.parse(localStorage.getItem('currencyconvertor'));
    storage.state.firstInput = 1;
    storage.state.secondInput = (this.state.exchange['EURRSD']).toFixed(2);
    localStorage.setItem('currencyconvertor', JSON.stringify(storage));
  }

  render() {
    function renderOptions(current) {
        return this.state.currency.map((curr) => {
        if(current !== curr) {
          return <option key={curr} value={curr}>{curr}</option>
        }
      })
    }

    return (
      <div className="app">
        <h1 className="header">CURRENCY CONVERTOR</h1>
        <div className="container">
          
          <div className="form-container">
            <div className="form">
              <select value={this.state.first} ref="first" onChange={this.onFirstChange.bind(this)} >
                {renderOptions.bind(this)(this.state.second)}
              </select>
              <input ref="firstInput" type="text" style={{color: this.state.firstInputError === 'please enter a number' ? "red" : "black"}} value={this.state.firstInput} onChange={this.onFirstInputChange.bind(this)} />
            </div>
            <div className="error">{this.state.firstInputError}</div>
          </div>
          <div className="swap" onClick={this.onSwapClick.bind(this)}></div>
          <div className="form-container">
            <div className="form">
              <select value={this.state.second} ref="second" onChange={this.onSecondChange.bind(this)} >
                {renderOptions.bind(this)(this.state.first)}
              </select>
              <input ref="secondInput" type="text" style={{color: this.state.secondInputError === 'please enter a number' ? "red" : "black"}} value={this.state.secondInput} onChange={this.onSecondInputChange.bind(this)} />
            </div>
            <div className="error">{this.state.secondInputError}</div>
          </div>
        </div>
         <div className="reset" onClick={this.onResetButtonClick.bind(this)}>Reset</div>
      </div>
    );
  }
}

export default App;
