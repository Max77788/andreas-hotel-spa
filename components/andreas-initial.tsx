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
    <span aria-label={word} className={`inline-flex items-baseline whitespace-nowrap leading-none ${className}`}>
      <span className="andreas-initial-mark" aria-hidden="true">
        <img
          src="/andreas_logo_a_white.png"
          alt="A"
          className={`andreas-initial-art ${imageClassName}`}
        />
      </span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
