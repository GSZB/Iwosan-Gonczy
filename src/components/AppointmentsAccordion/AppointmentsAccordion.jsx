import { useState } from 'react';
import { bottomArrowIcon } from '@assets';
import './AppointmentsAccordion.scss';

const appointmentsData = [
    {
        id: 'appt-1',
        name: 'Ibrahim Yokeni',
        type: 'Emergency',
        typeClass: 'emergency',
        date: 'Tuesday, October 24',
        avatar: '#e74c3c',
        notes: 'Patient requires immediate blood work and CT scan. Allergic to penicillin — use alternative antibiotics.',
    },
    {
        id: 'appt-2',
        name: 'Ebuka Kelechi',
        type: 'Examination',
        typeClass: 'examination',
        date: 'Monday, November 2',
        avatar: '#3498db',
        notes: 'Routine physical examination. Check blood pressure history and update vaccination records.',
    },
    {
        id: 'appt-3',
        name: 'Bridget Olowojeje',
        type: 'Consultation',
        typeClass: 'consultation',
        date: 'Friday, November 13',
        avatar: '#9b59b6',
        notes: 'Follow-up consultation for post-surgery recovery. Review physiotherapy progress notes.',
    },
    {
        id: 'appt-4',
        name: 'Michael Stewart',
        type: 'Routine Checkup',
        typeClass: 'routine',
        date: 'Thursday, December 9',
        avatar: '#2ecc71',
        notes: 'Patient needs blood test before surgery. Review previous lab results and fasting requirements.',
    },
];

const AppointmentsAccordion = () => {
    const [expandedId, setExpandedId] = useState(null);

    const handleToggle = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };


    return (
        <section className="appointments-widget" aria-labelledby="upcoming-appointments-title">
            <h2 className="appointments-widget__title" id="upcoming-appointments-title">
                Upcoming Appointments
            </h2>
            <div className="appointments-widget__list" role="list">
                {appointmentsData.map((appt) => {
                    const isExpanded = expandedId === appt.id;
                    const panelId = `panel-${appt.id}`;
                    const headerId = `header-${appt.id}`;

                    return (
                        <div className="appointments-widget__item" key={appt.id} role="listitem">
                            <button
                                id={headerId}
                                className={`appointments-widget__header ${isExpanded ? 'appointments-widget__header--expanded' : ''}`}
                                onClick={() => handleToggle(appt.id)}
                                aria-expanded={isExpanded}
                                aria-controls={panelId}
                            >
                                <div className="appointments-widget__avatar" aria-hidden="true">
                                    <span
                                        className="appointments-widget__avatar-dot"
                                        data-color={appt.avatar}
                                    />
                                </div>
                                <div className="appointments-widget__info">
                                    <span className="appointments-widget__name">{appt.name}</span>
                                    <span className={`appointments-widget__type appointments-widget__type--${appt.typeClass}`}>
                                        {appt.type}
                                    </span>
                                </div>
                                <div className="appointments-widget__meta">
                                    <span className="appointments-widget__date">{appt.date}</span>
                                    <span className={`appointments-widget__chevron ${isExpanded ? 'appointments-widget__chevron--open' : ''}`} aria-hidden="true">
                                        <img src={bottomArrowIcon} alt="" width="16" height="16" />
                                    </span>
                                </div>
                            </button>
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={headerId}
                                className={`appointments-widget__panel ${isExpanded ? 'appointments-widget__panel--open' : ''}`}
                            >
                                <div className="appointments-widget__panel-content">
                                    <p className="appointments-widget__notes">
                                        <span className="appointments-widget__notes-label">Notes:</span> {appt.notes}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AppointmentsAccordion;
