import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-5">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;