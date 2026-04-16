export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-surface-100 text-gray-600",
    primary: "bg-primary-50 text-primary-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}