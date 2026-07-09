export default function ActionMenu({ actions, onAction, triggerRef }) {
  return (
    <div
      className="dropdown-menu"
      style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '4px',
        zIndex: 10000,
        minWidth: '180px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action, index) => (
        <div
          key={index}
          className={`dropdown-item ${action.danger ? 'danger' : ''}`}
          onClick={() => {
            onAction(action);
          }}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
}
