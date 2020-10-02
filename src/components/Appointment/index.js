import React from 'react';

import 'components/Appointment/styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING ="DELETING";

export default function Appointment (props) {
  const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
  );


  const save =(name, interviewer) => {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id,interview)
    .then(res => {
      transition(SHOW);
    })
  };

  const deleting = () => {
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(res => {
      transition(EMPTY);
    })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show
          interviewer={props.interview.interviewer}
          student={props.interview.student}
          onDelete={() => deleting()}
        /> 
      }
      {mode === CREATE && (<Form 
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
    </article>
  )
}