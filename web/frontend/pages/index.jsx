import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { NavLink } from "react-router-dom";
import Product from "./Product";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page>
      {/* <TitleBar title={t("HomePage.title")} /> */}
      <TitleBar title={t("Cartrabbit Task")} />
      <Layout>
        <Layout.Section>
          {/* <ProductsCard /> */}
          <Product />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
