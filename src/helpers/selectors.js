export function getAppointmentsForDay(state,day) {
  const filteredDays = state.days.filter(days => days.name === day);
  if (!filteredDays[0]) {
    return [];
  } else {
    let filteredAppointments = [];
    state.days.forEach((perDay) => {
      if (perDay.name === day) {
        for (const perApt of perDay.appointments) {
          filteredAppointments.push(state.appointments[perApt]);
        }
      }
    });
    return filteredAppointments;
  }
}