import React from "react";
import clsx from "clsx";

interface PageProps {
  pageText?: string | React.ReactElement;
  pageNumber: number;
  onClick: (pageNumber: number) => void;
  isActive: boolean;
  isDisabled?: boolean;
  activeClass?: string;
  activeLinkClass?: string;
  itemClass?: string;
  linkClass?: string;
  disabledClass?: string;
  href?: string;
  ariaLabel?: string;
}

const Page = ({
  pageText,
  pageNumber,
  onClick,
  isActive = false,
  isDisabled = false,
  activeClass = "active",
  activeLinkClass,
  itemClass,
  linkClass,
  disabledClass = "disabled",
  href = "#",
  ariaLabel
}: PageProps) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDisabled) {
      return;
    }
    onClick(pageNumber);
  };

  const css = clsx(itemClass, {
    [activeClass]: isActive,
    [disabledClass]: isDisabled
  });
  
  // Varsayılan stil sınıfları ekle
  const defaultItemCss = isActive 
    ? "border-black bg-black text-white" 
    : isDisabled 
      ? "border-gray-200 text-gray-400 cursor-not-allowed"
      : "border-gray-300 text-gray-600 hover:bg-gray-50";

  const linkCss = clsx(linkClass, {
    [activeLinkClass || '']: isActive
  });

  return (
    <li className={clsx(css, defaultItemCss)} onClick={handleClick}>
      <a className={linkCss} href={href} aria-label={ariaLabel}>
        {pageText}
      </a>
    </li>
  );
};

export default Page;
