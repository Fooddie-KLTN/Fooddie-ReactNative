import { gql } from '@apollo/client';

export const ORDER_CONFIRMED_FOR_SHIPPERS = gql`
  subscription OrderConfirmedForShippers(
    $latitude: String!
    $longitude: String!
    $maxDistance: Float
    $shipperId: String!
  ) {
    orderConfirmedForShippers(
      latitude: $latitude
      longitude: $longitude
      maxDistance: $maxDistance
      shipperId: $shipperId
    ) {
      id
      status
      total
      restaurant {
        id
        name
        latitude
        longitude
        address {
          street
          ward
          district
          city
        }
      }
      
      user {
        id
        name
        phone
      }
      address {
        street
        ward
        district
        city
        latitude
        longitude
      }
      orderDetails {
        id
        quantity
        food {
          id
          name
          image
        }
      }
    }
  }
`;
