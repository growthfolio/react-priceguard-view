import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;
