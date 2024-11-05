import Head from "next/head"
import { Layout } from "components/layout"
import { fetchMenuItems } from "./api/fetch-menu-items"





export default function IndexPage({ children, menuItems }) {

  return (
    <Layout >
      <Head>
        <title>Next.js for Drupal</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div>
      <div> Homepage</div>
      </div>
    </Layout>
  )
}

