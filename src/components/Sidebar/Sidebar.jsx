import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    logoUrl, expandLight, expandDark, overviewLight, overviewDark,
    appointmentsLight, appointmentsDark, patientsLight, patientsDark,
    chatsLight, chatsDark, settingsLight, settingsDark,
    logoutLight, logoutDark, telephoneIcon, closeIcon
} from '@assets';
import './Sidebar.scss';

const navigationMain = [
    { id: 'overview', label: 'Overview', href: '#overview-section', iconLight: overviewLight, iconDark: overviewDark },
    { id: 'appointments', label: 'Appointments', href: '#appointments-section', iconLight: appointmentsLight, iconDark: appointmentsDark },
    { id: 'patients', label: 'Patients', href: '#patients-section', iconLight: patientsLight, iconDark: patientsDark },
    { id: 'chats', label: 'Chats', href: '#chats-section', iconLight: chatsLight, iconDark: chatsDark, badge: 10 },
];

const navigationAccount = [
    { id: 'settings', label: 'Settings', href: '#settings-section', iconLight: settingsLight, iconDark: settingsDark },
    { id: 'logout', label: 'Logout', href: '#logout-section', iconLight: logoutLight, iconDark: logoutDark, isDanger: true },
];

const Sidebar = ({ onCloseMobile }) => {
    const [activeItem, setActiveItem] = useState('overview');
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const theme = useSelector((state) => state.theme.mode);

    const isExpanded = isPinned || isHovered;

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '').replace('-section', '');
                setActiveItem(id);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handlePinToggle = () => {
        setIsPinned((prev) => !prev);
    };

    const sidebarClass = `sidebar ${isExpanded ? '' : 'sidebar--collapsed'}`;

    return (
        <nav
            className={sidebarClass}
            aria-label="Main Navigation"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="sidebar__logo-container">
                <img src={logoUrl} alt="Iwosan logo" className="sidebar__logo-img" />
                <span className="sidebar__logo-text">Iwosan<sup className="sidebar__logo-tm">TM</sup></span>
                <button
                    className="sidebar__mobile-close"
                    onClick={onCloseMobile}
                    aria-label="Close menu"
                >
                    <img src={closeIcon} alt="" width="24" height="24" aria-hidden="true" />
                </button>
                {isExpanded && (
                    <button
                        className={`sidebar__expand-btn ${isPinned ? 'sidebar__expand-btn--active' : ''}`}
                        onClick={handlePinToggle}
                        aria-label={isPinned ? 'Collapse sidebar' : 'Pin sidebar open'}
                        title={isPinned ? 'Collapse' : 'Expand'}
                    >
                        <img src={theme === 'dark' ? expandDark : expandLight} alt="" aria-hidden="true" />
                    </button>
                )}
            </div>

            <hr className="sidebar__divider" />

            <div className="sidebar__nav">
                <ul className="sidebar__list">
                    {navigationMain.map((item) => (
                        <li className="sidebar__item" key={item.id}>
                            <a
                                href={item.href}
                                className={`sidebar__link ${activeItem === item.id ? 'sidebar__link--active' : ''}`}
                                onClick={() => setActiveItem(item.id)}
                                aria-current={activeItem === item.id ? 'page' : undefined}
                                title={!isExpanded ? item.label : undefined}
                            >
                                <img
                                    src={theme === 'dark' ? item.iconDark : item.iconLight}
                                    className="sidebar__icon"
                                    alt=""
                                    aria-hidden="true"
                                />
                                <span className="sidebar__label">{item.label}</span>
                                {item.badge && <span className="sidebar__badge" aria-label={`${item.badge} unread`}>{item.badge}</span>}
                            </a>
                        </li>
                    ))}
                </ul>

                <h3 className="sidebar__section-title">Account</h3>
                <ul className="sidebar__list">
                    {navigationAccount.map((item) => (
                        <li className="sidebar__item" key={item.id}>
                            <a
                                href={item.href}
                                className={`sidebar__link ${item.isDanger ? 'sidebar__link--danger' : ''} ${activeItem === item.id ? 'sidebar__link--active' : ''
                                    }`}
                                onClick={() => setActiveItem(item.id)}
                                aria-current={activeItem === item.id ? 'page' : undefined}
                                title={!isExpanded ? item.label : undefined}
                            >
                                <img
                                    src={theme === 'dark' ? item.iconDark : item.iconLight}
                                    className="sidebar__icon"
                                    alt=""
                                    aria-hidden="true"
                                />
                                <span className="sidebar__label">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <hr className="sidebar__divider" />

            <div className="sidebar__emergency">
                <div className="sidebar__emergency-icon" aria-hidden="true">
                    <img src={telephoneIcon} alt="" width="20" height="20" />
                </div>
                <div className="sidebar__emergency-content">
                    <span className="sidebar__emergency-title">Emergency Hotlines:</span>
                    <a href="tel:+23492928289" className="sidebar__emergency-number">+234 92 928 2891</a>
                    <a href="tel:+23460821209" className="sidebar__emergency-number">+234 60 821 2098</a>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
