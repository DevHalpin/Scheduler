export function getAppointmentsForDay(state,day) {
  const filteredDays = state.days.filter(days => days.name === day);
  const dateFound = filteredDays[0];
  if (!dateFound) {
    return [];
  } else {
    const filteredAppointments = dateFound.appointments.map(perApt => {
      return state.appointments[perApt];
    })
    return filteredAppointments;
  }
}