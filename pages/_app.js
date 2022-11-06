import { ApolloProvider } from '@apollo/client'
import '../styles/globals.css'
import client from '../apollo-client'
import React from 'react';
import Head from 'next/head'


export default function MyApp(props) {
  const {Component, pageProps} = props
  const wrappedComponent = Component.Layout ? (
    <Component.Layout>
      <Component {...pageProps}/>
    </Component.Layout>
  ):(
    <Component {...pageProps}/>
  )

  return(
    // <ApolloProvider client={client}>
    // <Component {...pageProps} />
    // </ApolloProvider>
    <React.Fragment>
      <ApolloProvider client={client}>
      <Head>
        <title>Pokedex</title>
        <meta name="viewport" content='minimum-scale=1, initial-scale=1' ></meta>
      </Head>
      <div  style={{  height:' 100vw',width: '100vw'}}>
        <div/>
      {wrappedComponent}
      </div>
      </ApolloProvider>
    </React.Fragment>
  )
}

// export default MyApp
