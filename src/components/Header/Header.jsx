import { useState, useEffect, useRef, useCallback } from 'react';
import { searchIcon, notificationIcon, menuIcon } from '@assets';
import './Header.scss';

const Header = ({ onMenuToggle }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const closeDropdown = useCallback(() => {
        setIsDropdownOpen(false);
        triggerRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isDropdownOpen, closeDropdown]);

    const handleDropdownKeyDown = (event) => {
        const items = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
        if (!items?.length) return;

        const currentIndex = Array.from(items).indexOf(document.activeElement);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[nextIndex].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prevIndex].focus();
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            const firstItem = dropdownRef.current?.querySelector('[role="menuitem"]');
            firstItem?.focus();
        }
    }, [isDropdownOpen]);

    return (
        <header className="header">
            <button
                className="header__mobile-toggle"
                onClick={onMenuToggle}
                aria-label="Open sidebar menu"
            >
                <img src={menuIcon} alt="" width="24" height="24" aria-hidden="true" />
            </button>
            <div className="header__search">
                <img src={searchIcon} alt="" className="header__search-icon" width="20" height="20" aria-hidden="true" />
                <input
                    type="search"
                    className="header__search-input"
                    placeholder="Search pathology results"
                    aria-label="Search pathology results"
                />
            </div>

            <div className="header__actions">
                <button className="header__notification" aria-label="Notifications">
                    <img src={notificationIcon} alt="" width="15" height="15" aria-hidden="true" />
                </button>

                <span className="header__divider" aria-hidden="true" />

                <div className="header__profile" ref={dropdownRef}>
                    <button
                        ref={triggerRef}
                        className="header__profile-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="profile-dropdown"
                    >
                        <div className="header__profile-avatar" aria-hidden="true"></div>
                        <div className="header__profile-info">
                            <span className="header__profile-name">Akule Vivian</span>
                            <span className="header__profile-role">DOCTOR</span>
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="header__dropdown" id="profile-dropdown" role="menu" onKeyDown={handleDropdownKeyDown}>
                            <ul className="header__dropdown-list">
                                <li className="header__dropdown-item" role="none">
                                    <a href="#profile" className="header__dropdown-link" role="menuitem" tabIndex={-1}>My Profile</a>
                                </li>
                                <li className="header__dropdown-item" role="none">
                                    <a href="#settings" className="header__dropdown-link" role="menuitem" tabIndex={-1}>Settings</a>
                                </li>
                                <li className="header__dropdown-item" role="none">
                                    <a href="#logout" className="header__dropdown-link header__dropdown-link--danger" role="menuitem" tabIndex={-1}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
