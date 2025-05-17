export default function NextArrowIcon({
  width = '32',
  height = '32',
  className = '',
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_137_100013)">
        <circle cx="8" cy="8" r="8" />
        <path
          d="M6.5 5L9.5 8L6.5 11"
          stroke="#64748B"
          strokeWidth="1.125"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_137_100013">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
