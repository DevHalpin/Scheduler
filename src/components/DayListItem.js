import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

export default function DayListItem(props) {
    const {spots} = props
    const formatSpots = (spots) => {
        if (spots === 1) {
            return `${spots} spot remaining`
        } else if (spots > 1) {
            return `${spots} spots remaining`
        } else {
            return `no spots remaining`
        }
    }

    const remainingSpots = formatSpots(spots);

    const dayListItemClass = classNames('day-list__item',{
        'day-list__item--selected': props.selected,
        'day-list__item--full': props.spots === 0
    })

    return (
        <li className={dayListItemClass} onClick={() => props.setDay(props.name)}>
            <h2 >{props.name}</h2>
            <h3 >{remainingSpots}</h3>
        </li>
    );
}