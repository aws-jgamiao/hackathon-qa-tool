import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast ${type}`}>
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      <span>{message}</span>
    </div>
  );
}
