import React from 'react';
import Link from 'next/link';
import { fetchMenuItems } from 'pages/api/fetch-menu-items';

const Navbar = ({ menuItems }) => {

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
				<li>
					<Link href={"/"} className="text-white">
              {"Home"}
					</Link>
				</li>
        {menuItems?.map((item, index) => (
          <li key={index}>
            <Link href={item.url} className="text-white">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export async function getStaticProps() {
  const menuItems = await fetchMenuItems();

  return {
    props: {
      menuItems
    },
  }
}

export default Navbar;
