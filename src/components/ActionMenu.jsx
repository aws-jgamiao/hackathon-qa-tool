import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ActionMenu({ actions, onAction, triggerRef }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef?.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();

      // Position to the right of the trigger button
      let top = triggerRect.top + window.scrollY;
      let left = triggerRect.right + window.scrollX + 8;

      // If menu goes off right edge, position to the left
      if (left + 200 > window.innerWidth) {
        left = triggerRect.left + window.scrollX - 200 - 8;
      }

      // Keep menu within vertical bounds
      const menuHeight = menuRef.current.offsetHeight;
      if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - 10;
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
