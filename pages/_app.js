import "../src/components/acctec/scan.scss";
import "../src/components/HR/Customers.scss";
import "../src/components/Units/identity.scss";
import "../src/components/Units/Units.scss";
import "../src/App.scss";
import "../src/index.scss";
import { App } from "../pages/index";
import { useRouter } from "next/router";

export function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <App>
      <Component key={router.asPath} {...pageProps} />
    </App>
  );
}

export default MyApp;
