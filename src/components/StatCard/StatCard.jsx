import './StatCard.scss';

const StatCard = ({ title, children }) => {
    return (
        <article className="stat-card">
            <h3 className="stat-card__title">{title}</h3>
            <div className="stat-card__content">
                {children}
            </div>
        </article>
    );
};

export default StatCard;
