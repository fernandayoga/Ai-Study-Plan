export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white hover:bg-surface-100 text-gray-700 border border-surface-200 shadow-sm",
    ghost: "hover:bg-surface-100 text-gray-600",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}