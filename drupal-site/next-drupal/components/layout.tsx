// components/layout.tsx
import Link from 'next/link';
import { PreviewAlert } from 'components/preview-alert';
import Navbar from './navbar';
import { useMenu } from './menu-context';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { menuItems } = useMenu();

  return (
    <>
      <PreviewAlert />
      <div className="mx-auto">
        <header className='bg-gray-800'>
          <div className="container mx-auto px-4">
            <Navbar menuItems={menuItems} />
          </div>
        </header>
        <main className="container max-w-screen-xl py-10 mx-auto">{children}</main>
      </div>
    </>
  );
}
