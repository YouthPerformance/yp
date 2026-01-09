function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  showLabel = false,
  color = "cyan",
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    cyan: "bg-cyan-500",
    gold: "bg-gold-500",
    success: "bg-success",
  };

  return (
    <div className={className}>
      <div className={`w-full bg-black-400 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full ${colors[color]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-dark-text-tertiary">
          <span>
            {value} / {max}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
