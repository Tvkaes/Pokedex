import { ApolloProvider } from '@apollo/client'
import '../styles/globals.css'
import client from '../apollo-client'
import { createTheme } from '@mui/material';

function MyApp({ Component, pageProps }) {


  return(
    <ApolloProvider client={client}>
    <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
