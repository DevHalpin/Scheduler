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

export default function reducer (state, action) {
  switch (action.type) {
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      };
    case SET_INTERVIEW:
      const appointments = {
        ...state.appointments,
        [action.id]: {
          ...state.appointments[action.id],
          interview: action.interview && { ...action.interview }
        }
      }

      const days = updateSpots(state.days, appointments)

      return { ...state, appointments, days };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}