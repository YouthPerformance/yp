function Badge({ children, variant = "default", size = "md", className = "" }) {
  const variants = {
    default: "bg-black-300 text-dark-text-secondary",
    cyan: "bg-cyan-500/20 text-cyan-500",
    gold: "bg-gold-500/20 text-gold-500",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
