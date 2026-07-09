export default function ActionMenu({ actions, onAction }) {
  return (
    <div className="dropdown-menu">
      {actions.map((action, index) => (
        <div
          key={index}
          className={`dropdown-item ${action.danger ? 'danger' : ''}`}
          onClick={() => onAction(action)}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
}
