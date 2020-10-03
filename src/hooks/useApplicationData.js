import { useReducer, useEffect} from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return {...state,day: action.value};
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers
        };
      case SET_INTERVIEW:
        const appointment ={
          ...state.appointments[action.id],
          interview: action.interview && { ...action.interview }
        }
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        }

        const findDay = (days, id) => {
          for (let day of days) {
            for (let value of day.appointments) {
              if (value === id) {
                return day;
              }
            }
          }
          return null;
        };

        const foundDay = findDay(state.days, action.id);

        let spots = 0;
        for (let apptID of foundDay.appointments) {
          if (appointments[apptID].interview === null) {
            spots ++;
          }
        };

        const days = state.days.map(day => {
          if (day.name === foundDay.name) {
            return { ...day, spots };
          } else {
            return day;
          }
        });

        return { ...state, appointments, days };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviwers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, value: day})

  useEffect(() => {
    const daysURL = '/api/days';
    const apptURL = '/api/appointments'
    const interviewersURL = 'api/interviewers'
    Promise.all([
      axios.get(daysURL),
      axios.get(apptURL),
      axios.get(interviewersURL)
    ])
    .then(all => {
      const [days, appointments, interviewers] = all;
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data
        }
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const bookInterview = (id, interview) => {
    return axios.put(`api/appointments/${id}`,{ interview })
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview})
    })
  }

  const cancelInterview = (id) => {
    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null})
    });
  }
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}