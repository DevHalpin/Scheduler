import { useReducer, useEffect} from 'react';
import axios from 'axios';

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

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
    const interviewersURL = '/api/interviewers'
    webSocket.onmessage = function (event) {
      const { id, interview } = JSON.parse(event.data)
      dispatch({ type: SET_INTERVIEW, id, interview})
    }
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
    return () => webSocket.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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