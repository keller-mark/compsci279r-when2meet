import { useState, useCallback, useMemo } from 'react';
import App from './App';
import { TASK_REV, TASK, t1_jan2, t1_jan9, t2_nextweek, t2_twoweeks } from './timeslots';

// Reference: https://stackoverflow.com/a/30800715
function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export default function Intro() {
  const [currTask, setCurrTask] = useState(TASK.NONE);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [prevTask, setPrevTask] = useState();
  const [userSelections, setUserSelections] = useState();

  const startTask = useCallback((taskType) => {
    setStartTime(Date.now());
    setCurrTask(taskType);
  }, []);

  const clearTask = useCallback((selections) => {
    setUserSelections(selections);
    const nextEndTime = Date.now();
    const prevTask = currTask;
    setEndTime(nextEndTime);
    setPrevTask(prevTask);
    setCurrTask(TASK.NONE);

    const delta = nextEndTime - startTime;

    downloadObjectAsJson({
      app: 'when2meet',
      taskId: prevTask,
      task: TASK_REV[prevTask],
      time: delta,
      timeUnit: 'ms',
      timeString: `${Math.floor(delta / 1000)} seconds`,
      // Clear the timeslot.states property before saving
      selections,
    }, `when2meet_${TASK_REV[prevTask]}_${(new Date(nextEndTime)).toISOString()}`);
  }, [startTime]);

  const message = useMemo(() => {
    if(prevTask === null || prevTask === undefined) {
      return 'No previous task.';
    }
    return (
      <div>Previous task {TASK_REV[prevTask]} info saved.</div>
    );
  }, [endTime]);

  const buttons = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const weekId = urlParams.get('week');
    if(!weekId) {
      return null;
    }

    if(weekId.toLowerCase() === 'a') {
      return (
        <div>
          <button onClick={() => startTask(TASK.T1_WA)}>Task 1 (Jan 2)</button>&nbsp;
          <button onClick={() => startTask(TASK.T2_WA)}>Task 2 (next week)</button>
        </div>
      );
    }
    if(weekId.toLowerCase() === 'b') {
      return (
        <div>
          <button onClick={() => startTask(TASK.T1_WB)}>Task 1 (Jan 9)</button>&nbsp;
          <button onClick={() => startTask(TASK.T2_WB)}>Task 2 (two weeks)</button>
        </div>
      );
    }
  }, [window.location.search]);

  return (
    <div>
      {currTask === TASK.NONE ? (
        <div>
          <p>{message}</p>
          {buttons}
        </div>
      ) : null}
      {currTask === TASK.T1_WA ? (
        <App
          timeslots={t1_jan2}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T1_WB ? (
        <App
          timeslots={t1_jan9}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T2_WA ? (
        <App
          timeslots={t2_nextweek}
          clearTask={clearTask}
        />
      ) : null}
      {currTask === TASK.T2_WB ? (
        <App
          timeslots={t2_twoweeks}
          clearTask={clearTask}
        />
      ) : null}
    </div>
  );
}