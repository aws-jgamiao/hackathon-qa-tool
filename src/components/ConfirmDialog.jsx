import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isDangerous && <AlertTriangle size={24} style={{ color: '#c62828' }} />}
            <h2 style={{ margin: 0 }}>{title}</h2>
          </div>
          <button className="btn-icon" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          {message}
        </p>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-primary' : ''}`}
            onClick={onConfirm}
            style={
              isDangerous
                ? { background: '#c62828', color: 'white' }
                : {}
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
