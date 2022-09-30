import { useState, useCallback, useEffect, useRef } from 'react';
import range from 'lodash/range';
import ScheduleSelector from 'react-schedule-selector';

const startDate = new Date("Dec 1 2022 12:30:00 GMT-0400");

const people = {
  'John Doe': [
    new Date("Dec 1 2022 9:00:00 GMT-0500"),
    new Date("Dec 1 2022 9:30:00 GMT-0500"),
    new Date("Dec 1 2022 10:00:00 GMT-0500"),
    new Date("Dec 1 2022 10:30:00 GMT-0500"),
    new Date("Dec 1 2022 13:00:00 GMT-0500"),
    new Date("Dec 1 2022 13:30:00 GMT-0500"),
    new Date("Dec 1 2022 14:00:00 GMT-0500"),
    new Date("Dec 1 2022 14:30:00 GMT-0500"),

    new Date("Dec 3 2022 9:00:00 GMT-0500"),
    new Date("Dec 3 2022 9:30:00 GMT-0500"),
    new Date("Dec 3 2022 10:00:00 GMT-0500"),
    new Date("Dec 3 2022 10:30:00 GMT-0500"),
    new Date("Dec 3 2022 13:00:00 GMT-0500"),
    new Date("Dec 3 2022 13:30:00 GMT-0500"),
    new Date("Dec 3 2022 14:00:00 GMT-0500"),
    new Date("Dec 3 2022 14:30:00 GMT-0500"),
    
    new Date("Dec 5 2022 12:00:00 GMT-0500"),
    new Date("Dec 5 2022 12:30:00 GMT-0500"),
    new Date("Dec 5 2022 13:00:00 GMT-0500"),
    new Date("Dec 5 2022 13:30:00 GMT-0500"),
    new Date("Dec 5 2022 14:00:00 GMT-0500"),
    new Date("Dec 5 2022 14:30:00 GMT-0500"),
    new Date("Dec 5 2022 15:00:00 GMT-0500"),
    new Date("Dec 5 2022 15:30:00 GMT-0500"),
  ],
  'Jane Doe': [
    new Date("Dec 1 2022 13:00:00 GMT-0500"),
    new Date("Dec 1 2022 13:30:00 GMT-0500"),

    new Date("Dec 2 2022 13:00:00 GMT-0500"),
    new Date("Dec 2 2022 13:30:00 GMT-0500"),

    new Date("Dec 5 2022 14:00:00 GMT-0500"),
    new Date("Dec 5 2022 14:30:00 GMT-0500"),
    new Date("Dec 5 2022 15:00:00 GMT-0500"),
    new Date("Dec 5 2022 15:30:00 GMT-0500"),
  ],
};

function DateCell(props) {
  const {
    datetime,
    selected,
    setHovered,
  } = props;
  const others = Object.entries(people)
    .filter(([name, times]) => {
      return times.map(t => t.toString()).includes(datetime.toString())
    })
    .map(([name]) => name);
  const numAttending = (selected ? 1 : 0) + others.length;
  const opacity = numAttending > 0 ? `${numAttending / 3.0}` : `1.0`;

  const cellRef = useRef();
  useEffect(() => {
    function handleHover(event) {
      let otherNames = others;
      if(selected) {
        otherNames = [...others, "You"];
      }
      setHovered([datetime, otherNames]);
    }
    function handleLeave(event) {
      setHovered(null);
    }
    if(cellRef.current) {
      cellRef.current.addEventListener('mouseenter', handleHover);
      cellRef.current.addEventListener('mouseout', handleLeave);
    }
    return () => {
      if(cellRef.current) {
        cellRef.current.removeEventListener('mouseenter', handleHover);
        cellRef.current.removeEventListener('mouseout', handleLeave);
      }
    }
  }, [cellRef, datetime, others, selected]);
  
  return (
    <div className="group-date-cell" ref={cellRef}>
      <div className="group-date-cell-inner" style={{backgroundColor: numAttending > 0 ? `rgba(51, 153, 0, ${opacity}` : null }}></div>
    </div>
  );
}

// Define the top-level <App/> component
// which is exported and rendered from ./main.jsx.
function App() {

  const [schedule, setSchedule] = useState([]);
  const [hovered, setHovered] = useState(null);

  const handleChange = useCallback((newSchedule) => {
    setSchedule(newSchedule);
  });

  const maxNum = Object.keys(people).length + 1;

  return (
    <div>
      {/* The app title */}
      <div className="app">
        <h4>When2meet</h4>
        <h2>Barbecue</h2>
        <p>
          To invite people to this event,
          you can email them,
          send them a Facebook message,
          or just direct them to https://keller-mark.github.io/compsci279r-when2meet/.
        </p>
        <p><label>Your Time Zone:&nbsp;</label><select><option>America/New_York</option></select></p>
        <div className="main">
          {hovered ? (
            <div className="time-col">
              <h3>{hovered ? hovered[1].length : 0}/{maxNum} Available</h3>
              <p>{hovered ? hovered[0].toString() : null}</p>
              <div className="time-col-inner">
                <div>
                  <h5>Available</h5>
                  <ul>
                    {hovered ? hovered[1].map(name => (
                      <li>{name}</li>
                    )) : null}
                  </ul>
                </div>
                <div>
                  <h5>Unavailable</h5>
                  <ul>
                    {hovered ? [...Object.keys(people), "You"].filter(name => !hovered[1].includes(name)).map(name => (
                      <li>{name}</li>
                    )) : null}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="you-col">
              <h3>Your Availability</h3>
              <div className="you-legend">
                <label>Unavailable</label><span style={{ backgroundColor: '#ffdede' }}></span>
                <label>Available</label><span style={{ backgroundColor: '#339900' }}></span>
              </div>
              <p>Click and Drag to Toggle; Saved Immediately</p>
              <div className="you-selector">
                <ScheduleSelector
                  startDate={startDate}
                  selection={schedule}
                  numDays={5}
                  minTime={9}
                  maxTime={12+5}
                  hourlyChunks={2}
                  onChange={handleChange}
                  rowGap={'1px'}
                  columnGap={'1px'}
                  unselectedColor={'#ffdede'}
                  selectedColor={'#339900'}
                  hoveredColor={'#ccc'}
                  selectionScheme={'square'}
                />
              </div>
            </div>
          )}
          <div className="group-col">
            <h3>Group's Availability</h3>
            <div className="group-legend">
              <label>0/{maxNum} Available</label>
              <div>
                {range(maxNum+1).map(i => (
                  <span style={{ backgroundColor: `rgba(51, 153, 0, ${i/(maxNum)}` }}></span>
                ))}
              </div>
              <label>{maxNum}/{maxNum} Available</label>
            </div>
            <p>Mouseover the Calendar to See Who Is Available</p>
            <div className="group-selector">
              <ScheduleSelector
                startDate={startDate}
                selection={schedule}
                numDays={5}
                minTime={9}
                maxTime={12+5}
                hourlyChunks={2}
                onChange={() => {}}
                rowGap={'1px'}
                columnGap={'1px'}
                unselectedColor={'#eee'}
                selectedColor={'#339900'}
                hoveredColor={''}
                selectionScheme={'square'}
                renderDateCell={(datetime, selected, refSetter) => {
                  return (
                    <DateCell datetime={datetime} selected={selected} setHovered={setHovered} />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
