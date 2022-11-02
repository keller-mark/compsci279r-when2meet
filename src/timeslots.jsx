// Contents copied from when2meet/timeslots.jsx

export const STATE = {
  NO: 0,
  YES: 1,
  MAYBE: 1, // same as yes in when2meet
};

export const TASK = {
  NONE: 0,
  T1_WA: 1,
  T1_WB: 2,
  T2_WA: 3,
  T2_WB: 4,
};

export const TASK_REV = Object.fromEntries(Object.entries(TASK).map(([k, v]) => ([v, k])));

// Store a list of time slot objects.
export const t1_jan2 = [
  {
    // Monday, four hours
    start: new Date("January 2, 2023 09:00:00"),
    end: new Date("January 2, 2023 13:00:00"),
    states: {
      // Store the selection of each participant for this time slot.
      'Elena': STATE.YES,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.NO,
    }
  },
  {
    // Tuesday, two hours
    start: new Date("January 3, 2023 10:00:00"),
    end: new Date("January 3, 2023 12:00:00"),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.NO,
    }
  },
  {
    // Tuesday, one hour
    start: new Date("January 3, 2023 12:00:00"),
    end: new Date("January 3, 2023 13:00:00"),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.YES,
      'Priyan': STATE.NO,
    }
  },
  {
    // Wednesday, two hours
    start: new Date("January 4, 2023 13:00:00"),
    end: new Date("January 4, 2023 15:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.NO,
    }
  },
  {
    // Thursday, five hours
    start: new Date("January 5, 2023 10:00:00"),
    end: new Date("January 5, 2023 15:00:00"),
    states: {
      'Elena': STATE.MAYBE,
      'Mark': STATE.NO,
      'Priyan': STATE.MAYBE,
    }
  },
  {
    // Friday, two hours
    start: new Date("January 6, 2023 9:00:00"),
    end: new Date("January 6, 2023 11:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.YES,
    }
  }
];

export const t1_jan9 = [
  {
    // Monday, four hours
    start: new Date("January 9, 2023 13:00:00"),
    end: new Date("January 9, 2023 17:00:00"),
    states: {
      // Store the selection of each participant for this time slot.
      'Elena': STATE.YES,
      'Mark': STATE.NO,
      'Priyan': STATE.NO,
    }
  },
  {
    // Tuesday, two hours
    start: new Date("January 10, 2023 11:00:00"),
    end: new Date("January 10, 2023 13:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.NO,
      'Priyan': STATE.MAYBE,
    }
  },
  {
    // Tuesday, one hour
    start: new Date("January 10, 2023 15:00:00"),
    end: new Date("January 10, 2023 16:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.NO,
      'Priyan': STATE.YES,
    }
  },
  {
    // Wednesday, two hours
    start: new Date("January 11, 2023 9:00:00"),
    end: new Date("January 11, 2023 11:00:00"),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.YES,
      'Priyan': STATE.NO,
    }
  },
  {
    // Thursday, five hours
    start: new Date("January 12, 2023 11:00:00"),
    end: new Date("January 12, 2023 16:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.YES,
      'Priyan': STATE.MAYBE,
    }
  },
  {
    // Friday, two hours
    start: new Date("January 13, 2023 11:00:00"),
    end: new Date("January 13, 2023 13:00:00"),
    states: {
      'Elena': STATE.NO,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.YES,
    }
  }
];

const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
const msPerHour = 60 * 60 * 1000;
const today = new Date();
const todayMs = today.getTime();
const todayDayOfWeek = today.getDay();

const nextMondayOffset = (todayDayOfWeek === 1 ? 6 : (todayDayOfWeek === 0 ? 1 : 6 - todayDayOfWeek + 2));
const nextMonday = new Date(todayMs + nextMondayOffset * msPerDay);
nextMonday.setHours(0, 0, 0);
const nextMondayMs = nextMonday.getTime();

export const t2_nextweek = [
  {
    start: new Date(nextMondayMs + msPerHour * 9),
    end: new Date(nextMondayMs + msPerHour * 11),
    states: {
      // Store the selection of each participant for this time slot.
      'Elena': STATE.YES,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.NO,
    }
  },
  {
    start: new Date(nextMondayMs + msPerHour * 13),
    end: new Date(nextMondayMs + msPerHour * 15),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.NO,
      'Priyan': STATE.YES,
    }
  },
  {
    start: new Date(nextMondayMs + msPerDay + msPerHour * 9),
    end: new Date(nextMondayMs + msPerDay + msPerHour * 10),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.YES,
      'Priyan': STATE.NO,
    }
  },
  {
    start: new Date(nextMondayMs + msPerDay + msPerHour * 15),
    end: new Date(nextMondayMs + msPerDay + msPerHour * 17),
    states: {
      'Elena': STATE.MAYBE,
      'Mark': STATE.NO,
      'Priyan': STATE.NO,
    }
  },
  {
    start: new Date(nextMondayMs + msPerDay * 2 + msPerHour * 11),
    end: new Date(nextMondayMs + msPerDay * 2 + msPerHour * 12),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.MAYBE,
      'Priyan': STATE.MAYBE,
    }
  },
  {
    start: new Date(nextMondayMs + msPerDay * 4 + msPerHour * 12),
    end: new Date(nextMondayMs + msPerDay * 4 + msPerHour * 14),
    states: {
      'Elena': STATE.YES,
      'Mark': STATE.NO,
      'Priyan': STATE.NO,
    }
  }
];
export const t2_twoweeks = t2_nextweek.map(obj => ({
  ...obj,
  start: new Date(obj.start.getTime() + msPerDay * 7),
  end: new Date(obj.end.getTime() + msPerDay * 7),
}));