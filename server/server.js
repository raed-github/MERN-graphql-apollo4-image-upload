import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs, resolvers } from "./schema.js";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
    "/",
    cors(),
    bodyParser.json(),
    graphqlUploadExpress(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    })
);


// await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

app.use(express.static('public'))
app.listen({ port: 4000},()=>{
    console.log('🚀 Server ready at http://localhost:4000/')
})


