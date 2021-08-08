import clsx from 'clsx';

export interface PaginationOpts {
  pageCount: number;
  currentPage: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

interface PaginationButton {
  page: number;
  label: string;
};

const SEPARATOR = -1;
type PaginationItem = PaginationButton | typeof SEPARATOR;

// The P in "pagination" stands for pain.
const Pagination = ({ pageCount, currentPage, disabled, onChange }: PaginationOpts) => {
  const items: PaginationItem[] = [];

  // Display a "Prev" button if the current page is not the first one.
  // Expected output: [Prev]
  if (currentPage > 1) {
    items.push({ page: currentPage - 1, label: 'Prev' });
  }

  // Display the button for the first page.
  // Expected output: [1]
  items.push({ page: 1, label: '1' });

  // If there are at least 4 pages and the current page number is less than 4.
  // Expected outputs:
  //    * [1] [2] [3] ... [n]
  //    * [1] [2] [3] [4] [5]
  if (currentPage < 4 && pageCount > 4) {
    // Display the second and third pages.
    items.push(...Array(2).fill(null).map((_, idx) => ({ page: idx + 2, label: `${idx + 2}` })));

    // If the current page is the last one in this batch (3), display the
    // following page (4) too.
    if (currentPage === 3) {
      items.push({ page: 4, label: '4' });
    }

    // Display a separator if there are at least 6 pages and we're not in the
    // middle of the total batch.
    if (!(pageCount <= 5 && currentPage >= Math.ceil(pageCount / 2))) {
      items.push(SEPARATOR);
    }
  }

  // If there are at least 4 pages and the current page number is greater than
  // or equal to 4, but less than the number of total pages minus 2, display a
  // separator, then the page before the current page, then the current page,
  // then the page after the current page.
  // Expected output: [1] ... [5] [6] [7] ... [n]
  if (currentPage >= 4 && currentPage < pageCount - 2 && pageCount > 4) {
    items.push(SEPARATOR);
    items.push({ page: currentPage - 1, label: `${currentPage - 1}` });
    items.push({ page: currentPage, label: `${currentPage}` });
    items.push({ page: currentPage + 1, label: `${currentPage + 1}` });
    items.push(SEPARATOR);
  }

  // If there are at least 4 pages and the current page number is greater than
  // or equal to the number of total pages minus 2, and the current page isn't
  // the middle one.
  // Expected outputs:
  //    * [1] ... [n - 2] [n - 1] [n]
  //    * [1] ... [n - 3] [n - 2] [n - 1] [n]
  if (currentPage >= pageCount - 2 && currentPage !== Math.ceil(pageCount / 2) && pageCount > 4) {
    // Display a separator for good measure.
    items.push(SEPARATOR);

    // If the current page is equal to the number of total pages minus 2,
    // display the page before the current page.
    if (currentPage === pageCount - 2) {
      items.push({ page: pageCount - 3, label: `${pageCount - 3}` });
    }

    // Display the two pages before the last page.
    items.push(...Array(2).fill(null).map((_, idx) => ({ page: pageCount + idx - 2, label: `${pageCount + idx - 2}` })));
  }

  // Edge case: if the number of pages is between (2, 4], display all the
  // remaining pages (i.e. the ones between the first and last pages).
  // Expected outputs:
  //    * [1] [2] [3]
  //    * [1] [2] [3] [4]
  if (pageCount <= 4 && pageCount > 2) {
    items.push(...Array(pageCount - 2).fill(null).map((_, idx) => ({ page: idx + 2, label: `${idx + 2}` })));
  }

  // Display the last page ONLY if there are at least 2 pages.
  // Expected output: [n]
  if (pageCount > 1) {
    items.push({ page: pageCount, label: `${pageCount}` });
  }

  // Display a "Next" button if the current page is not the last one.
  // Expected output: [Next]
  if (currentPage < pageCount) {
    items.push({ page: currentPage + 1, label: 'Next' });
  }

  const handleClick = (item: PaginationButton) => {
    if (disabled || item.page === currentPage) {
      return;
    }

    onChange(item.page);
  };

  return (
    <div className="flex items-center gap-2 justify-center" >
      {items.map((item, idx) => (
        <div key={idx}>
          {item === SEPARATOR && '...'}
          {item !== SEPARATOR && (
            <div
              onClick={() => handleClick(item)}
              className={clsx(
                'border-2 border-ayame-primary rounded-md px-3 py-2 hover:bg-ayame-primary hover:text-white cursor-pointer select-none text-sm',
                {
                  'bg-ayame-primary': item.page === currentPage,
                  'text-white': item.page === currentPage
                }
              )}
            >
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Pagination;
