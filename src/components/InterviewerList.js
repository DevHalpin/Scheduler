import React from 'react';

import 'components/InterviewerList.scss';
import InterviewerListItem from 'components/InterviewerListItem';

import PropTypes from 'prop-types';

InterviewerList.propTypes = {
    interviewer: PropTypes.number,
    setInterviewer: PropTypes.func.isRequired
};

export default function InterviewerList (props) {
    const interview = props.interviewers.map(interview => {
        return (
        <InterviewerListItem 
            key ={interview.id}
            name={interview.name} 
            avatar={interview.avatar}
            selected={interview.id === props.value}
            setInterviewer={event => props.onChange(interview.id)}  
        />
        );
    })

    return (
        <section className="interviewers">
            <h4 className="interviewers__header text--light">Interviewer</h4>
            <ul className="interviewers__list">{interview}</ul>
        </section>
    )
}