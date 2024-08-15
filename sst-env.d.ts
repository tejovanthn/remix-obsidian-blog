/* tslint:disable */
 
import "sst"
declare module "sst" {
  export interface Resource {
    "MyWeb": {
      "type": "sst.aws.Remix"
      "url": string
    }
  }
}
export {}
