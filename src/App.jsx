import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './store/themeSlice';
import { sunLightIcon, sunDarkIcon } from '@assets';
import Layout from './components/Layout/Layout';
import DashboardOverview from './components/DashboardOverview/DashboardOverview';
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <Layout>
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-row">
          <div className="dashboard__welcome-text">
            <h1 className="dashboard__welcome-title">
              <span className="dashboard__welcome-highlight">Welcome Vivian,</span>
            </h1>
            <p className="dashboard__welcome-subtitle">
              How're you feeling today?
            </p>
          </div>
          <div className="dashboard__theme">
            <img
              src={theme === 'dark' ? sunDarkIcon : sunLightIcon}
              alt=""
              className="dashboard__theme-img"
              width="20"
              height="20"
              aria-hidden="true"
            />
            <button
              className="dashboard__theme-toggle"
              onClick={handleToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span className={`dashboard__theme-track ${theme === 'dark' ? 'dashboard__theme-track--dark' : ''}`}>
                <span className={`dashboard__theme-thumb ${theme === 'dark' ? 'dashboard__theme-thumb--dark' : ''}`} />
              </span>
              <span className="dashboard__theme-label">
                Apply {theme === 'dark' ? 'Light' : 'Dark'} Theme
              </span>
            </button>
          </div>
        </div>
      </div>

      <DashboardOverview />

      <section id="appointments-section" className="dashboard__section">
        <h2 className="dashboard__section-title">Appointments</h2>
        <p className="dashboard__section-text">Placeholder content for Appointments...</p>
      </section>

      <section id="patients-section" className="dashboard__section">
        <h2 className="dashboard__section-title">Patients</h2>
        <p className="dashboard__section-text">Placeholder content for Patients...</p>
      </section>

      <section id="chats-section" className="dashboard__section">
        <h2 className="dashboard__section-title">Chats</h2>
        <p className="dashboard__section-text">Placeholder content for Chats...</p>
      </section>

      <section id="settings-section" className="dashboard__section">
        <h2 className="dashboard__section-title">Settings</h2>
        <p className="dashboard__section-text">Placeholder content for Settings...</p>
      </section>

      <section id="logout-section" className="dashboard__section">
        <h2 className="dashboard__section-title">Logout</h2>
        <p className="dashboard__section-text">Placeholder content for Logout (Testing scrolling)...</p>
      </section>
    </Layout>
  );
}

export default App;
