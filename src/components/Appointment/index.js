import React from 'react';

import 'components/Appointment/styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment (props) {
  const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
  );


  const save =(name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id,interview)
    .then(res => {
      transition(SHOW);
    })
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show
          interviewer={props.interview.interviewer}
          student={props.interview.student}
        /> 
      }
      {mode === CREATE && (<Form 
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />)}
    </article>
  )
}