export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}