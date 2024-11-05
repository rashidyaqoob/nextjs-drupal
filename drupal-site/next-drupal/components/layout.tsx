import Link from "next/link"

import { PreviewAlert } from "components/preview-alert"
import Navbar from "./navbar"



export function Layout({ children, menuItems }) {
  return (
    <>
      <PreviewAlert />
      <div className="max-w-screen-md px-6 mx-auto">
        <header>
          <Navbar menuItems={menuItems} />
        </header>
        <main className="container py-10 mx-auto">{children}</main>
      </div>
    </>
  );
}
