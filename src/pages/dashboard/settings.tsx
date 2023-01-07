import { DashboardLayout } from "src/components/dashboard/layout/Layout";
import { SettingsView } from "src/views/dashboard/settings/Settings";

import type { NextPage } from "next";

const Settings: NextPage = () => {
  return (
    <DashboardLayout>
      <SettingsView />
    </DashboardLayout>
  );
};

export default Settings;