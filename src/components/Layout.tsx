// Components
import Header from "./Header/Header";

const Layout = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  return (
    <div className="flex h-full w-full flex-col bg-dummy bg-cover">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
