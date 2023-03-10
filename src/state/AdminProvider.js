import SelectedCustomerProvider from "./selectedCustomer";
import SelectedRFIDProvider from "./selectedRFID";
import ConfigCustomerProvider from "./ConfigGroups";

export const AdminProvider = ({ children }) => {
  return (
    <SelectedCustomerProvider>
      <SelectedRFIDProvider>
        <ConfigCustomerProvider>{children}</ConfigCustomerProvider>
      </SelectedRFIDProvider>
    </SelectedCustomerProvider>
  );
};
