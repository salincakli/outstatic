import { graphql } from '../gql/gql'

// Gets the git commit oid expected at the head
// of the branch prior to the commit.
export const OID = graphql(`
  query Oid($owner: String!, $name: String!, $branch: String!) {
    repository(owner: $owner, name: $name) {
      id
      ref(qualifiedName: $branch) {
        target {
          ... on Commit {
            history(first: 1) {
              nodes {
                oid
              }
            }
          }
        }
      }
    }
  }
`)
