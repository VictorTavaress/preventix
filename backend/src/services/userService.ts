import dynamoDB from "../config/dynamodb";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";


const USERS_TABLE = process.env.USERS_TABLE!;

export async function createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
    };

    await dynamoDB.send(
        new PutCommand({
            TableName: USERS_TABLE,
            Item: user,
        })
    );

    return user;
}

export async function getUserByEmail(email: string) {
    const result = await dynamoDB.send(
        new QueryCommand({
            TableName: USERS_TABLE,
            IndexName: "EmailIndex",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: { ":email": email },
        })
    );

    return result.Items?.[0];
}

export async function getAllUsers() {
    try {
        const command = new ScanCommand({ TableName: "Users" });
        const result = await dynamoDB.send(command);
        return result.Items || [];
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw new Error("Erro ao buscar usuários");
    }
}
