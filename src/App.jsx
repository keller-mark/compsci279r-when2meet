import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import range from 'lodash/range';
import ScheduleSelector from 'react-schedule-selector';
import { STATE } from './timeslots';

// Implement a React component which represents a date/time cell
// that accounts for the number of people available, and
// computes a background color with opacity using RGBA based on availability.
function DateCell(props) {
  const {
    people,
    maxNum,
    // The datetime and selected props are passed from the ScheduleSelector
    // renderDateCell parameters.
    datetime,
    selected,
    // The setHovered is passed from the parent to set the hover state,
    // including the hovered datetime, and the names of people available for the datetime.
    setHovered,
  } = props;

  // Filter the names of the people to get a list of who is available at this datetime.
  const others = Object.entries(people)
    .filter(([name, times]) => {
      // Do string comparison to check whether the datetimes match.
      return times.map(t => t.toString()).includes(datetime.toString())
    })
    // Convert from [key, val] to only key.
    .map(([name]) => name);
  
  // Compute the number of people attending. Add an extra count for the current user if they have selected this datetime.
  const numAttending = (selected ? 1 : 0) + others.length;
  // Compute the opacity based on the number of people.
  const opacity = numAttending > 0 ? `${numAttending / maxNum}` : `1.0`;

  // Get a React ref to the element to add mouse hover handlers.
  const cellRef = useRef();
  // Add (and clean up) the hover handlers in a React effect.
  useEffect(() => {
    // Define the hover handler, which calls the setHover to set the parent hover state.
    function handleHover(event) {
      let otherNames = others;
      if(selected) {
        // Append "You" for the current user if necessary.
        otherNames = [...others, "You"];
      }
      // The hover state is a tuple like (datetime, names) where names is an array of strings.
      setHovered([datetime, otherNames]);
    }
    // Define the un-hover handler, which sets the hover state to Null.
    function handleLeave(event) {
      setHovered(null);
    }
    // Add the handlers.
    if(cellRef.current) {
      cellRef.current.addEventListener('mouseenter', handleHover);
      cellRef.current.addEventListener('mouseout', handleLeave);
    }
    // Define the cleanup function.
    return () => {
      if(cellRef.current) {
        cellRef.current.removeEventListener('mouseenter', handleHover);
        cellRef.current.removeEventListener('mouseout', handleLeave);
      }
    }
  }, [cellRef, datetime, others, selected]);
  // Return the styled <div/>.
  return (
    <div className="group-date-cell" ref={cellRef}>
      <div className="group-date-cell-inner" style={{backgroundColor: numAttending > 0 ? `rgba(51, 153, 0, ${opacity}` : null }}></div>
    </div>
  );
}


// Hard-code the availability of the other people.
const people = {
  'Mark': [
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

// Define the top-level <App/> component
// which is exported and rendered from ./main.jsx.
function App(props) {
  const {
    timeslots,
    clearTask,
  } = props;

  const startDate = timeslots[0].start;

  // Convert others' availability to the people array.
  const [people, maxNum] = useMemo(() => {
    const names = Object.keys(timeslots[0].states);
    const result = {};
    names.forEach(name => {
      result[name] = [];
    });

    timeslots.forEach(timeslot => {
      const { start, end, states } = timeslot;
      Object.entries(states).forEach(([name, state]) => {
        if(state === STATE.YES) {
          // TODO: should every time _except_ those with STATE.NO be included?
          //result[name].push(start);
          const endMs = end.getTime();
          const startMs = start.getTime();
          const msPerHour = 60 * 60 * 1000;
          const intervalMs = msPerHour / 2;
          const numIntervals = (endMs - startMs) / intervalMs;
          range(numIntervals).forEach(i => {
            result[name].push(new Date(startMs + intervalMs * i));
          });
        }
      });
    });

    const maxResult = Object.keys(result).length + 1;

    return [result, maxResult];
  }, [timeslots]);

  // Define the state variables.
  // One for the schedule passed to ScheduleSelector, an array of Date objects,
  // representing the time slots selected by the user.
  const [schedule, setSchedule] = useState([]);
  // Another variable for the hover state,
  // a tuple (datetime, names).
  const [hovered, setHovered] = useState(null);

  // Define the ScheduleSelector onChange handler.
  const handleChange = useCallback((newSchedule) => {
    setSchedule(newSchedule);
  });

  function handleSubmit() {
    clearTask(schedule);
  }

  return (
    <div>
      {/* The app title */}
      <div className="app">
        {/* The event details */}
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
          {/* When a particular Group Availability time slot has been hovered, show the list of available/unavailable names. */}
          {hovered ? (
            <div className="time-col">
              {/* Show the fraction of people available for the hovered time slot */}
              <h3>{hovered ? hovered[1].length : 0}/{maxNum} Available</h3>
              <p>{hovered ? hovered[0].toString() : null}</p>
              <div className="time-col-inner">
                <div>
                  {/* Show the list of people available for the hovered time slot */}
                  <h5>Available</h5>
                  <ul>
                    {hovered ? hovered[1].map(name => (
                      <li>{name}</li>
                    )) : null}
                  </ul>
                </div>
                <div>
                  {/* Show the list of people who are NOT available for the hovered time slot */}
                  <h5>Unavailable</h5>
                  <ul>
                    {/* Take the set difference between all people and those available. Reference: https://stackoverflow.com/a/1723220 */}
                    {hovered ? [...Object.keys(people), "You"].filter(name => !hovered[1].includes(name)).map(name => (
                      <li>{name}</li>
                    )) : null}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="you-col">
              {/* When not hovering on the Group Availability, show the selection interface to the user. */}
              <h3>Your Availability</h3>
              {/* Show the legend to denote which color means what. */}
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
          {/* Always show the group availability table. */}
          <div className="group-col">
            <h3>Group's Availability</h3>
            {/* Show the legend to indicate which color means how many people, from light to dark -> least to most. */}
            <div className="group-legend">
              <label>0/{maxNum} Available</label>
              <div>
                {/* Create colored elements in the range 0 to 3 inclusive. */}
                {range(maxNum+1).map(i => (
                  <span style={{ backgroundColor: `rgba(51, 153, 0, ${i/(maxNum)}` }}></span>
                ))}
              </div>
              <label>{maxNum}/{maxNum} Available</label>
            </div>
            <p>Mouseover the Calendar to See Who Is Available</p>
            <div className="group-selector">
              {/* To show the group availability, use a second ScheduleSelector, which is read-only (onChange is no-op) but reads the same selection state variable as the read-write user-input ScheduleSelector above. */}
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
                    // Render a custom datecell which takes into account the hard-coded "people" object
                    // indicating others' availability.
                    <DateCell
                      people={people}
                      maxNum={maxNum}
                      datetime={datetime}
                      selected={selected}
                      setHovered={setHovered}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', marginTop: '10px', marginBottom: '100px', width: '350px' }}>
          <button onClick={handleSubmit}>Continue</button>
        </div>
      </div>
    </div>
  )
}

export default App
