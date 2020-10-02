import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';

import DayList from 'components/DayList';
import Appointment from 'components/Appointment';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors.js';

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);


  const setDay = day => setState({ ...state,day })
  // const setDays = days => setState(prev =>({ ...prev,days }));

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
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const bookInterview = (id, interview) => {
    const appointment ={
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    setState({...state, appointments})
    return axios.put(`api/appointments/${id}`,{ interview })
  }
  
  let list = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment 
        {...appointment}
        key={appointment.id} 
        interview={interview} 
        interviewers={interviewers}
        bookInterview={bookInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu"><DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
      {list}
      <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
