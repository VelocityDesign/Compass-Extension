import React from 'react';
import axios from 'axios';
import {
  StyledWeatherIcon,
  StyledWeatherBText,
  StyledWeatherText
} from './style';

class Weather extends React.Component {
  public state = {
    weather: '',
    temp: '',
    unit: '',
    img: '',
    div1css: { opacity: 0, transition: '0.6s opacity ease-in-out' }
  };

  componentDidMount() {
    let host = 'http://localhost:3000';
    if (process.env.NODE_ENV == 'production') {
      host = 'https://new.dothq.co/';
    }
    const s = window.localStorage;
    if (s.getItem('weather_weatherUnit') == null) {
      s.setItem('weather_weatherUnit', '°C');
    }
    if (
      s.getItem('weather_weatherCountry') != null &&
      s.getItem('weather_weatherCity') != null
    ) {
      axios
        .get(
          `${host}/api/ntp/weather/${s.getItem(
            'weather_weatherCountry'
          )}/${s.getItem('weather_weatherCity')}`
        )
        .then((response) => {
          if (response.status == 200) {
            let { temp } = response.data.main;
            const unit = s.getItem('weather_weatherUnit');
            const approvedWeatherStates = ['Rain', 'Clouds', 'Sunny'];
            /* eslint-disable prefer-const */
            let nextimg = '/icons/unknown.svg';
            console.log(
              approvedWeatherStates.includes(response.data.weather[0].main)
            );
            if (approvedWeatherStates.includes(response.data.weather[0].main)) {
              const a = response.data.weather[0].main;
              nextimg = `/icons/${a.toLowerCase()}.svg`;
            }
            if (s.getItem('weather_weatherUnit') == '°C') {
              temp -= 273.15;
            }
            if (s.getItem('weather_weatherUnit') == '°F') {
              temp = ((temp - 273.15) * 9) / 5 + 32;
            }
            this.setState({
              weather: response.data.weather[0].main,
              temp: Math.floor(temp),
              unit,
              img: nextimg,
              div1css: { opacity: 1, transition: '0.6s opacity ease-in-out' }
            });
          }
        })
        .catch(() => {
          let nextimg = '/icons/error.svg';
          this.setState({
            weather: 'Error',
            temp: 'Could not refresh!',
            unit: '',
            img: nextimg,
            div1css: { opacity: 1, transition: '0.6s opacity ease-in-out' }
          });
        });
    } else {
      this.setState({
        weather: '',
        temp: 'Set up weather information in Settings.',
        unit: '',
        img: '/icons/unknown.svg',
        div1css: {
          width: '200px',
          opacity: 1,
          transition: '0.6s opacity ease-in-out'
        }
      });
    }
  }

  render() {
    return (
      <div style={this.state.div1css}>
        <div>
          <StyledWeatherIcon src={this.state.img} />
          <StyledWeatherBText>{this.state.weather}</StyledWeatherBText>
          <StyledWeatherText>
            {this.state.temp}
            {this.state.unit}
          </StyledWeatherText>
        </div>
      </div>
    );
  }
}

export default Weather;
