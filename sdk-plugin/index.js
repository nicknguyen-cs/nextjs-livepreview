import Contentstack from "contentstack";
import * as Utils from "@contentstack/utils";


const Stack = Contentstack.Stack(
  {
    api_key: process.env.CONTENTSTACK_API_KEY,
    delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    environment: process.env.CONTENTSTACK_ENVIRONMENT,
    live_preview: {
      management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
      enable: true,
      host: 'api.contentstack.io',
      ssr: true,
    }
  }
)
/**
 * Make sure to setHost after the initial SDK is started. This is a must.
 */
Stack.setHost('api.contentstack.io');

const renderOption = {
  ["span"]: (node, next) => {
    return next(node.children);
  },
};

export default {
  Stack,
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({ contentTypeUid, entryUrl, referenceFieldPath, jsonRtePath, variation }) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      blogQuery.includeOwner().toJSON();
      let data = {};
      if (variation) {
        console.log("Personalized: ", variation);
        let q1= Stack.ContentType(contentTypeUid).Query().where("url", `${entryUrl}`);
        let q2= Stack.ContentType(contentTypeUid).Query().where("personalization", `${variation}`);
        data = blogQuery.and(q1,q2).find();
      }
      else {
        console.log("Non-personalized");
        data = blogQuery.where("url", `${entryUrl}`).find();
      }
     
      data.then((result) => {
        console.log("RESULT!!!", result);
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
            console.log(result);
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};