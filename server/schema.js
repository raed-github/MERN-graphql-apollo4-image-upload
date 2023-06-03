import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const generateFileName = (length)=> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
    }


export const typeDefs = `#graphql
    scalar Upload
    
    type Image {
        # id: String!
        # filename: String!
        url: String!
    }

    type Query {
        images: [Image!]
    }
    
    type Mutation {
        uploadImage(id: String!, image: Upload!): Image!
    }
`;

const images = [];

export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        images: () => images,
    },
    Mutation: {
        uploadImage: async (_, { id, image }) => {
        const { filename, createReadStream, mimetype,encoding } = await image;
        const { ext, name } = path.parse(filename)
        const newFileName = generateFileName(12)+ext
        console.log(`Uploading ${filename}...`);
    
        const stream = createReadStream();
        // Promisify the stream and store the file, then…
        const newImage = { id, filename };
        images.push(newImage);
        console.log(images)

        const pathName = path.join(__dirname,`/public/images/${newFileName}`)
        await stream.pipe(fs.createWriteStream(pathName))
        // return newImage;
        return{
            url: `http://localhost:4000/images/${newFileName}`
        }
        },
    },
};
