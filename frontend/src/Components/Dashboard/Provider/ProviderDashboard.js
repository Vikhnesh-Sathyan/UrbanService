import ProviderSidebar from "./ProviderSidebar";
import ProviderNavbar from "./ProviderNavbar";

const ProviderDashboard = () => {
  return (
    <div className="provider-dashboard">

      <ProviderSidebar />

      <main className="provider-main">

        <ProviderNavbar />

        {/* Dashboard content will come here */}

      </main>

    </div>
  );
};

export default ProviderDashboard;