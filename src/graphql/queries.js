/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      clientId
      username
      notes {
        id
        clientId
        title
        content
        updatedAt
      }
      displayName
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        clientId
        username
        notes {
          id
          clientId
          title
          content
          updatedAt
        }
        displayName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
