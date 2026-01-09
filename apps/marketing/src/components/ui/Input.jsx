import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = "text",
      size = "md",
      fullWidth = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const inputClasses = [
      "w-full bg-black-300 border rounded-lg text-white placeholder-dark-text-tertiary",
      "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500",
      "transition-colors duration-200",
      sizes[size],
      error ? "border-error focus:ring-error/50 focus:border-error" : "border-black-400",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">{label}</label>
        )}
        <input ref={ref} type={type} className={inputClasses} {...props} />
        {(error || helperText) && (
          <p className={`mt-2 text-sm ${error ? "text-error" : "text-dark-text-tertiary"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
