import { ReactNode, useCallback, useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type AppShellProps = {
  children: ReactNode;
  contentClassName?: string;
  mainClassName?: string;
};

export default function AppShell({
  children,
  contentClassName = 'p-4 sm:p-6 lg:p-8',
  mainClassName = 'flex-1 overflow-y-auto',
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-col md:pl-64">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className={mainClassName}>
          {contentClassName ? <div className={contentClassName}>{children}</div> : children}
        </main>
      </div>
    </div>
  );
}
