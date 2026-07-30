export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    secondary: "bg-black/20 hover:bg-black/40 text-gray-200 border border-white/10 shadow-sm",
    ghost: "hover:bg-white/10 text-gray-300 hover:text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]",
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