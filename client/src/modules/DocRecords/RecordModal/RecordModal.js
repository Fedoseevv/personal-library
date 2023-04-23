import './RecordModal.css';

export const RecordModal = ({ active, setActive, children }) => {
    return (
        <div className={active ? "recModal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "recModal__content active" : "modal__content"} onClick={(e) => e.stopPropagation()}>
                { children }
            </div>
        </div>
    );
}