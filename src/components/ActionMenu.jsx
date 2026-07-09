import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ActionMenu({ actions, onAction, triggerRef }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef?.current && menuRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Position to the right of button, below it
        const top = triggerRect.bottom + scrollY + 4;
        const left = triggerRect.left + scrollX;

        setPosition({ top, left });
      }
    };

    // Initial position
    updatePosition();

    // Update on scroll
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [triggerRef]);

  const menuContent = (
    <div
      ref={menuRef}
      className="dropdown-menu"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10000,
        minWidth: '180px'
      }}
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
