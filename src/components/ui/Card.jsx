export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-black/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}