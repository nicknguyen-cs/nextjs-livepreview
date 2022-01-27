import React from "react";
import StackUtils from "../sdk-plugin/index";
import Layout from "../components/layout";
import RenderComponents from "../components/render-components";
import { addEditableTags } from "@contentstack/utils"

export default function Home(props) {
  const { header, footer, result } = props;
  return (
    <Layout header={header} footer={footer} page={result}>
      {result.page_components && (
        <RenderComponents
          pageComponents={result?.page_components}
          contentTypeUid="page"
          entryUid={result?.uid}
          locale={result?.locale}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  /**
   * context.query will/should return the hash value that is sent from the UI to the code base.
   */
  if (context.query) {
    StackUtils.Stack.livePreviewQuery(context.query);
  }
  try {
    const result = await StackUtils.getEntryByUrl({
      contentTypeUid: "page",
      entryUrl: context.resolvedUrl,
      referenceFieldPath: [
        "page_components.from_blog.featured_blogs",
      ],
      jsonRtePath: [
        "page_components.from_blog.featured_blogs.body",
        "page_components.section_with_buckets.buckets.description",
      ],
    });
    const header = await StackUtils.getEntry({
      contentTypeUid: "header",
      referenceFieldPath: ["navigation_menu.page_reference"],
      jsonRtePath: ["notification_bar.announcement_text"],
    });
    const footer = await StackUtils.getEntry({
      contentTypeUid: "footer",
      jsonRtePath: ["copyright"],
    });
    /**
     * addEditableTags will inject the 'data-cslp' attribute tag into the JSON payload. From there you will need to add these as attribute tags in 
     * the DOM elements. This will link the entry field to the dom field for quick referencing with the edit buttons. 
     * i.e -  '$' : { 'data-cslp' : '{content-type-uid.entry-uid.locale.path.to.field} }
     */
    addEditableTags(result[0], "page", true); 
    addEditableTags(header[0][0], "header", true);
    addEditableTags(footer[0][0], "footer", true);
    return {
      props: {
        header: header[0][0],
        footer: footer[0][0],
        result: result[0],
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
