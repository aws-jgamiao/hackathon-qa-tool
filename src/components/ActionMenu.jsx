import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ActionMenu({ actions, onAction, triggerRef }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef?.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let top = triggerRect.bottom + window.scrollY + 8;
      let left = triggerRect.right - menuRect.width + window.scrollX;

      // Ensure menu doesn't go off screen
      if (left < 0) left = triggerRect.left + window.scrollX;
      if (top + menuRect.height > window.innerHeight) {
        top = triggerRect.top + window.scrollY - menuRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [triggerRef]);

  const menuContent = (
    <div
      ref={menuRef}
      className="dropdown-menu"
      style={{ position: 'fixed', ...position, zIndex: 10000 }}
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

  // Use portal to render outside the table overflow
  return createPortal(menuContent, document.body);
}
