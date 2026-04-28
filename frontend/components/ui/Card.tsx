import React from "react";
import Link from "next/link";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", href, onClick }: CardProps) {
  const baseClasses = "border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const content = (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
