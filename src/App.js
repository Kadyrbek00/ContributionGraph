import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'moment/locale/ru';
import moment from 'moment';
import './App.css'

const App = () => {
  const [data, setData] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverInfoText, setHoverInfoText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://dpg.gg/test/calendar.json');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderGrid = () => {
    const grid = [];
    const today = moment();
    const startDate = today.clone().subtract(50, 'weeks');

    let currentDate = startDate.clone();

    for (let week = 0; week < 51; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dateString = currentDate.format('YYYY-MM-DD');
        const contributions = data[dateString] || 0;
        weekData.push(
          <>
            <div
              key={dateString}
              className={`grid-item ${getContributionsColorClass(contributions)}`}
              onMouseEnter={() => handleBlockHover(dateString, contributions)}
              onMouseLeave={() => setHoverInfo(null)}
              style={{ position: 'relative' }}
            >
              {hoverInfo === dateString && <HoverInfo info={hoverInfoText} />}
            </div>
          </>
        );
        currentDate.add(1, 'day');
      }
      grid.push(<div key={`week-${week}`} className="grid-row">{weekData}</div>);
    }

    return grid;
  };

  const renderMonthLabels = () => {
    const monthLabels = [];
    const today = moment();
    const startDate = today.clone().subtract(50, 'weeks');

    let currentDate = startDate.clone();
    let currentMonth = currentDate.format('M');

    for (let week = 0; week < 51; week++) {
      const weekMonth = currentDate.format('M');
      if (weekMonth !== currentMonth) {
        currentMonth = weekMonth;
        monthLabels.push(
          <div key={`month-${currentMonth}`} className="month-label">
            {currentDate.locale('ru').format('MMM')}
          </div>
        );
      }
      currentDate.add(7, 'days');
    }

    return monthLabels;
  };

  const getContributionsColorClass = (contributions) => {
    if (contributions === 0) return 'color-none';
    if (contributions >= 1 && contributions <= 9) return 'color-low';
    if (contributions >= 10 && contributions <= 19) return 'color-medium';
    if (contributions >= 20 && contributions <= 29) return 'color-high';
    return 'color-max';
  };

  const handleBlockHover = (dateString, contributions) => {
    const date = moment(dateString);
    const dayOfWeek = date.format('dddd');
    const monthDayofYear = date.format('MMM D, YYYY');
    const hoverInfoText = `${contributions} Contributions\n${dayOfWeek}, ${monthDayofYear}`;
    setHoverInfo(dateString);
    setHoverInfoText(hoverInfoText);
  };

  return (
    <>
      <div className="month-labels">{renderMonthLabels()}</div>
      <div className="contribution-graph">
        <ul>
          <li>Пн</li>
          <li>Ср</li>
          <li>Пт</li>
        </ul>
        {renderGrid()}
      </div>
      <div className="foot">
        <span className='text'>Меньше</span>
        <div className='color-none'></div>
        <div className='color-low'></div>
        <div className='color-medium'></div>
        <div className='color-high'></div>
        <span className='text'>Больше</span>
      </div>
    </>
  );
};

const HoverInfo = ({ info }) => {
  return <div className="hover-info">{info}</div>;
};

export default App;
