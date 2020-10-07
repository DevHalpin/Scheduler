import { useReducer, useEffect} from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

export default function useApplicationData() {

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