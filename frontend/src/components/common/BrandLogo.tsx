import { Link } from "react-router-dom";

type BrandLogoProps = {
  className?: string;
  href?: string;
  imageClassName?: string;
  textClassName?: string;
};

export function BrandLogo({
  className = "",
  href = "/",
  imageClassName = "h-10 w-10",
  textClassName = "font-headline text-2xl font-bold tracking-tight text-primary",
}: BrandLogoProps) {
  return (
    <Link className={`inline-flex items-center gap-3 ${className}`.trim()} to={href}>
      <img
        alt="NileConnect logo"
        className={`${imageClassName} rounded-lg object-contain`.trim()}
        src="/nileconnect-logo.png"
      />
      <span className={textClassName}>NileConnect</span>
    </Link>
  );
}
