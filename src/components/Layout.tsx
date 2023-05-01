import Header from "./Header/Header";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
