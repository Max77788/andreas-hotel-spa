type AndreasInitialProps = {
  suffix: string;
  className?: string;
  imageClassName?: string;
};

export default function AndreasInitial({
  suffix,
  className = "",
  imageClassName = "",
}: AndreasInitialProps) {
  const word = `A${suffix}`;

  return (
    <span aria-label={word} className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <img
        src="/andreas_logo_a_white.png"
        alt="A"
        className={`inline-block h-[1em] w-auto shrink-0 align-text-bottom -mr-[0.04em] ${imageClassName}`}
      />
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
