export function getAppointmentsForDay(state,day) {
  const filteredDays = state.days.filter(days => days.name === day);
  const dateFound = filteredDays[0];
  if (!dateFound) {
    return [];
  }
  const filteredAppointments = dateFound.appointments.map(perApt => {
    return state.appointments[perApt];
  })
  return filteredAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewObj = {"student": interview.student, "interviewer": state.interviewers[interview.interviewer]};
  return interviewObj;
}

export function getInterviewersForDay(state,day) {
  const filteredDays = state.days.filter(days => days.name === day);
  const dateFound = filteredDays[0];
  if (!dateFound) {
    return [];
  }
  const filteredInterviewers = dateFound.interviewers.map(perApt => {
    return state.interviewers[perApt];
  })
  return filteredInterviewers;
}