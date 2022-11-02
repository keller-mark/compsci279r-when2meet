import { useState, useCallback, useMemo } from 'react';
import App from './App';
import { TASK_REV, TASK, t1_jan2, t1_jan9, t2_nextweek, t2_twoweeks } from './timeslots';

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
    setEndTime(Date.now());
    setPrevTask(currTask);
    setCurrTask(TASK.NONE);
  }, [startTime]);

  const message = useMemo(() => {
    if(prevTask === null || prevTask === undefined) {
      return 'No previous task';
    }
    const delta = endTime - startTime;
    return (
      <>
        <div>Previous task {TASK_REV[prevTask]} took {Math.floor(delta / 1000)} seconds</div>
        <pre>{JSON.stringify(userSelections, null, 2)}</pre>
      </>
    );
  }, [endTime]);

  return (
    <div>
      {currTask === TASK.NONE ? (
        <div>
          <p>{message}</p>
          <p>
            <button onClick={() => startTask(TASK.T1_WA)}>Task 1 (Jan 2)</button>
            <button onClick={() => startTask(TASK.T2_WA)}>Task 2 (next week)</button>
            <br/><br/>
            <button onClick={() => startTask(TASK.T1_WB)}>Task 1 (Jan 9)</button>
            <button onClick={() => startTask(TASK.T2_WB)}>Task 2 (two weeks)</button>
          </p>
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