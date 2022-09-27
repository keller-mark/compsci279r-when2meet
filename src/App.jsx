import { useState, useCallback } from 'react';
import ScheduleSelector from 'react-schedule-selector'


// Define the top-level <App/> component
// which is exported and rendered from ./main.jsx.
function App() {

  const [schedule, setSchedule] = useState([]);

  const handleChange = useCallback((newSchedule) => {
    setSchedule(newSchedule);
  });
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
          <div className="you-col">
            <h3>Mark's Availability</h3>
            <div className="you-legend">
              <label>Unavailable</label><span style={{ backgroundColor: '#ffdede' }}></span>
              <label>Available</label><span style={{ backgroundColor: '#339900' }}></span>
            </div>
            <p>Click and Drag to Toggle; Saved Immediately</p>
            <div className="you-selector">
              <ScheduleSelector
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
          <div className="time-col">
            <h3>1/1 Available <pre style={{ color: 'red'}}>[TODO: show on group hover]</pre></h3>
            <p>Mon 26 Sep 2022 10:30:00 AM EDT</p>
            <table>
              <thead>
                <tr>
                  <th>Available</th>
                  <th>Unavailable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mark</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="group-col">
            <h3>Group's Availability</h3>
            <div className="group-legend">
              <label>0/1 Available</label>
              <div>
                <span style={{ backgroundColor: '#eee' }}></span>
                <span style={{ backgroundColor: '#339900' }}></span>
              </div>
              <label>1/1 Available</label>
            </div>
            <p>Mouseover the Calendar to See Who Is Available</p>
            <div className="group-selector">
              <ScheduleSelector
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
