import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ActionMenu({ actions, onAction, triggerRef }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      // triggerRef may be either a DOM element or a ref object wrapping one.
      const triggerEl = triggerRef?.current ?? triggerRef;
      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 180
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [triggerRef]);

  const menu = (
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
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );

  return createPortal(menu, document.body);
}
