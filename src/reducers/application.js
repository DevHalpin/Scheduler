export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

const remainingSpotsForDay = (day, appointments) =>{
  let spots = 0;
  for (const apptID of day.appointments) {
    if (appointments[apptID].interview === null) {
      spots ++;
    }
  };
  return spots;
};

const updateSpots = (days, appointments) => {
  const daysWithSpots = days.map(day => {
    return { ...day, spots: remainingSpotsForDay(day, appointments) };
  });
  return daysWithSpots;
};

const setDay = (state, action) => {
  return {...state,day: action.value};
}

const setAppData = (state, action) => {
  return {
    ...state,
    days: action.value.days,
    appointments: action.value.appointments,
    interviewers: action.value.interviewers
  };
}

const setInterview = (state, action) => {
  const appointments = {
    ...state.appointments,
    [action.id]: {
      ...state.appointments[action.id],
      interview: action.interview && { ...action.interview }
    }
  }

  const days = updateSpots(state.days, appointments)

  return { ...state, appointments, days };
}

const reducers = {
  [SET_DAY] : setDay,
  [SET_APPLICATION_DATA] : setAppData,
  [SET_INTERVIEW] : setInterview
}

export default function useReducer (state, action) {
  if(reducers[action.type])
  {
    return reducers[action.type](state, action)
  }    
  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}