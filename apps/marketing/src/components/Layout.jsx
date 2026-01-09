import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import SearchOverlay from "./SearchOverlay";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <SearchOverlay />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
