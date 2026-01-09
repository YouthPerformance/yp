import { forwardRef } from "react";

const variants = {
  primary:
    "bg-cyan-500 hover:bg-cyan-600 text-black font-semibold shadow-glow-cyan hover:shadow-glow-cyan transition-all",
  secondary: "border border-white/30 text-white hover:bg-white/10 transition-colors",
  ghost: "text-cyan-500 hover:text-cyan-400 hover:underline transition-colors",
  danger: "bg-error hover:bg-error/90 text-white font-semibold transition-colors",
  gold: "bg-gold-500 hover:bg-gold-600 text-black font-semibold shadow-glow-gold transition-all",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-md h-btn-sm",
  md: "px-6 py-3 text-base rounded-lg h-btn-md",
  lg: "px-8 py-4 text-lg rounded-lg h-btn-lg",
  xl: "px-10 py-5 text-lg rounded-xl h-btn-xl",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      fullWidth = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const classes = [
      baseClasses,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
