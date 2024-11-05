import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMenuItems } from 'pages/api/fetch-menu-items';

interface MenuContextProps {
  menuItems: any[] | null;
}

const MenuContext = createContext<MenuContextProps>({ menuItems: null });

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<any[] | null>(null);

  useEffect(() => {
    const getMenuItems = async () => {
      const fetchedMenuItems = await fetchMenuItems();
      setMenuItems(fetchedMenuItems);
    };
    getMenuItems();
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
