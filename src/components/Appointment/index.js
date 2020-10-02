import React from 'react';

import 'components/Appointment/styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from './Status';
import Confirm from './Confirm';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment (props) {
  const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
  );


  const save =(name, interviewer) => {
    transition(SAVE);
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
    transition(DELETE);
    props.cancelInterview(props.id)
    .then(res => {
      transition(EMPTY);
    })
  }

  const confirming = () => {
    transition(CONFIRM);
  }

  const editing = () => {
    transition(EDIT);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (<Show
          interviewer={props.interview.interviewer}
          student={props.interview.student}
          onEdit={() => editing()}
          onDelete={() => confirming()}
        /> 
      )}
      {mode === CREATE && (<Form 
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === CONFIRM && (<Confirm
          message="Delete the appointment?"
          onConfirm={() => deleting()}
          onCancel={() => back()}
        />
      )}
      {mode === EDIT && (<Form 
          name={props.interview.student}
          interviewer={props.interviewers.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
    </article>
  )
}