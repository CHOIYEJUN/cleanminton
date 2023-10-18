import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import client from "./client";
import {ApolloProvider, } from "@apollo/client";
import { loadErrorMessages , loadDevMessages } from "@apollo/client/dev";

const root = ReactDOM.createRoot(document.getElementById('root'));

loadErrorMessages();
loadDevMessages();
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
