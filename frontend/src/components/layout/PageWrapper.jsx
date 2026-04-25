import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageWrapper: Bọc mỗi trang để:
 * 1. Áp dụng animation fade+slide-up khi chuyển trang
 * 2. Tự động scroll về đầu trang khi route thay đổi
 */
const PageWrapper = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    // key=pathname forces re-mount → triggers animation on every navigation
    <div key={pathname} className="page-enter w-full flex-1 flex flex-col">
      {children}
    </div>
  );
};

export default PageWrapper;
