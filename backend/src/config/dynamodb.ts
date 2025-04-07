import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "dotenv";

config();

const client = new DynamoDBClient({
    region: "sa-east-1",
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    // },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

export default dynamoDB;
