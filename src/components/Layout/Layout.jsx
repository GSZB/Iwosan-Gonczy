import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './Layout.scss';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <div className="layout">
            <div
                className={`layout__overlay ${isMobileMenuOpen ? 'layout__overlay--active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            <aside className={`layout__sidebar ${isMobileMenuOpen ? 'layout__sidebar--mobile-open' : ''}`}>
                <Sidebar
                    onCloseMobile={() => setIsMobileMenuOpen(false)}
                />
            </aside>
            <main className="layout__main">
                <div className="layout__container">
                    <Header onMenuToggle={toggleMobileMenu} />
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
