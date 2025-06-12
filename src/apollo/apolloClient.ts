import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const backendUrl = Constants.expoConfig?.extra?.baseUrl;
console.log('Backend URL:', backendUrl);

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
console.log('API URL:', apiUrl);

const API_HTTP_URL = `${apiUrl}/graphql`;
const API_WS_URL = `ws://${backendUrl}/graphql`; 

console.log('API_HTTP_URL:', API_HTTP_URL);
console.log('API_WS_URL:', API_WS_URL);

const httpLink = new HttpLink({ uri: API_HTTP_URL });

const wsLink = new GraphQLWsLink(
  createClient({
    url: API_WS_URL,
    connectionParams: async () => {
      const token = await AsyncStorage.getItem('token');
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
