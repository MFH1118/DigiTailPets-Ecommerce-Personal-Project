//src/components/layout/header.tsx
import TopHeader from '@/components/TopHeader';
import NavigationHeader from '@/components/NavigationHeader';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto max-w-[1220px]">
        <TopHeader />
        <NavigationHeader />
      </div>
    </header>
  );
};

export default Header;