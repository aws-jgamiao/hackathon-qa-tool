import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ActionMenu({ actions, onAction, triggerRef }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef?.current) {
      // Use a small delay to ensure menuRef is measured
      const timer = setTimeout(() => {
        if (menuRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const menuHeight = menuRef.current.offsetHeight;
          const menuWidth = menuRef.current.offsetWidth;

          // Position directly to the right of button, aligned with top
          let top = triggerRect.top + window.scrollY - 4;
          let left = triggerRect.right + window.scrollX + 4;

          // If menu goes off right edge, position to the left of button
          if (left + menuWidth > window.innerWidth - 10) {
            left = triggerRect.left + window.scrollX - menuWidth - 4;
          }

          // If menu goes below viewport, position above button
          if (top + menuHeight > window.innerHeight - 10) {
            top = triggerRect.bottom + window.scrollY - menuHeight - 4;
          }

          setPosition({ top, left });
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [triggerRef]);

  const menuContent = (
    <div
      ref={menuRef}
      className="dropdown-menu"
      style={{ position: 'fixed', ...position, zIndex: 10000, minWidth: '180px' }}
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
