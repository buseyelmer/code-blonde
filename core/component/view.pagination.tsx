import React from "react";
//@ts-ignore
import paginator from "paginator";
import Page from "./view.page";
import clsx from "clsx";

interface PaginationProps {
  totalItemsCount: number;
  onChange: (pageNumber: number) => void;
  activePage?: number;
  itemsCountPerPage?: number;
  pageRangeDisplayed?: number;
  prevPageText?: string | React.ReactElement;
  nextPageText?: string | React.ReactElement;
  lastPageText?: string | React.ReactElement;
  firstPageText?: string | React.ReactElement;
  disabledClass?: string;
  hideDisabled?: boolean;
  hideNavigation?: boolean;
  innerClass?: string;
  itemClass?: string;
  itemClassFirst?: string;
  itemClassPrev?: string;
  itemClassNext?: string;
  itemClassLast?: string;
  linkClass?: string;
  activeClass?: string;
  activeLinkClass?: string;
  linkClassFirst?: string;
  linkClassPrev?: string;
  linkClassNext?: string;
  linkClassLast?: string;
  hideFirstLastPages?: boolean;
  getPageUrl?: (page: number) => string;
}

const defaultProps: Partial<PaginationProps> = {
  itemsCountPerPage: 10,
  pageRangeDisplayed: 5,
  activePage: 1,
  prevPageText: "⟨",
  firstPageText: "«",
  nextPageText: "⟩",
  lastPageText: "»",
  innerClass: "pagination",
  hideFirstLastPages: false,
  getPageUrl: (i) => "#"
};

const Pagination: React.FC<PaginationProps> = (props) => {
  const allProps = { ...defaultProps, ...props };

  const isFirstPageVisible = (has_previous_page: boolean): boolean => {
    const { hideDisabled, hideNavigation, hideFirstLastPages } = allProps;
    if (hideFirstLastPages || (hideDisabled && !has_previous_page)) return false;
    return true;
  };

  const isPrevPageVisible = (has_previous_page: boolean): boolean => {
    const { hideDisabled, hideNavigation } = allProps;
    if (hideNavigation || (hideDisabled && !has_previous_page)) return false;
    return true;
  };

  const isNextPageVisible = (has_next_page: boolean): boolean => {
    const { hideDisabled, hideNavigation } = allProps;
    if(hideNavigation || (hideDisabled && !has_next_page)) return false;
    return true;
  };

  const isLastPageVisible = (has_next_page: boolean): boolean => {
    const { hideDisabled, hideNavigation, hideFirstLastPages } = allProps;
    if (hideFirstLastPages || (hideDisabled && !has_next_page)) return false;
    return true;
  };

  const buildPages = () => {
    const pages: React.ReactElement[] = [];
    const {
      itemsCountPerPage,
      pageRangeDisplayed,
      activePage,
      prevPageText,
      nextPageText,
      firstPageText,
      lastPageText,
      totalItemsCount,
      onChange,
      activeClass,
      itemClass,
      itemClassFirst,
      itemClassPrev,
      itemClassNext,
      itemClassLast,
      activeLinkClass,
      disabledClass,
      linkClass,
      linkClassFirst,
      linkClassPrev,
      linkClassNext,
      linkClassLast,
      getPageUrl
    } = allProps;

    const paginationInfo = new paginator(
      itemsCountPerPage!,
      pageRangeDisplayed!
    ).build(totalItemsCount, activePage!);

    for (
      let i = paginationInfo.first_page;
      i <= paginationInfo.last_page;
      i++
    ) {
      pages.push(
        <Page
          isActive={i === activePage}
          key={i}
          href={getPageUrl!(i)}
          pageNumber={i}
          pageText={i + ""}
          onClick={onChange}
          itemClass={itemClass}
          linkClass={linkClass}
          activeClass={activeClass}
          activeLinkClass={activeLinkClass}
          ariaLabel={`Go to page number ${i}`}
        />
      );
    }

    if (isPrevPageVisible(paginationInfo.has_previous_page)) {
      pages.unshift(
        <Page
          isActive={false}
          key={"prev" + paginationInfo.previous_page}
          href={getPageUrl!(paginationInfo.previous_page)}
          pageNumber={paginationInfo.previous_page}
          onClick={onChange}
          pageText={prevPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={clsx(itemClass, itemClassPrev)}
          linkClass={clsx(linkClass, linkClassPrev)}
          disabledClass={disabledClass}
          ariaLabel="Go to previous page"
        />
      );
    }

    if (isFirstPageVisible(paginationInfo.has_previous_page)) {
      pages.unshift(
        <Page
          isActive={false}
          key={"first"}
          href={getPageUrl!(1)}
          pageNumber={1}
          onClick={onChange}
          pageText={firstPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={clsx(itemClass, itemClassFirst)}
          linkClass={clsx(linkClass, linkClassFirst)}
          disabledClass={disabledClass}
          ariaLabel="Go to first page"
        />
      );
    }

    if (isNextPageVisible(paginationInfo.has_next_page)) {
      pages.push(
        <Page
          isActive={false}
          key={"next" + paginationInfo.next_page}
          href={getPageUrl!(paginationInfo.next_page)}
          pageNumber={paginationInfo.next_page}
          onClick={onChange}
          pageText={nextPageText}
          isDisabled={!paginationInfo.has_next_page}
          itemClass={clsx(itemClass, itemClassNext)}
          linkClass={clsx(linkClass, linkClassNext)}
          disabledClass={disabledClass}
          ariaLabel="Go to next page"
        />
      );
    }

    if (isLastPageVisible(paginationInfo.has_next_page)) {
      pages.push(
        <Page
          isActive={false}
          key={"last"}
          href={getPageUrl!(paginationInfo.total_pages)}
          pageNumber={paginationInfo.total_pages}
          onClick={onChange}
          pageText={lastPageText}
          isDisabled={
            paginationInfo.current_page === paginationInfo.total_pages
          }
          itemClass={clsx(itemClass, itemClassLast)}
          linkClass={clsx(linkClass, linkClassLast)}
          disabledClass={disabledClass}
          ariaLabel="Go to last page"
        />
      );
    }

    return pages;
  };

  const pages = buildPages();
  return <ul className={allProps.innerClass}>{pages}</ul>;
};

export default Pagination;