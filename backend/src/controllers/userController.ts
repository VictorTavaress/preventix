import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createUser, getUserByEmail, getAllUsers } from "../services/userService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyToken } from '../middlewares/authMiddleware';


export const registerUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { name, email, password } = JSON.parse(event.body || "{}");

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Usuário já existe" }),
            };
        }

        const user = await createUser(name, email, password);
        return {
            statusCode: 201,
            body: JSON.stringify({ id: user.id, name, email }),
        };
    } catch (error) {
        console.error("Erro no registerUser:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao registrar usuário" }),
        };
    }
};

export const loginUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password } = JSON.parse(event.body || "{}");

        const user = await getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Credenciais inválidas" }),
            };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (error) {
        console.error("Erro no loginUser:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao autenticar usuário" }),
        };
    }
};

export async function getUsers(event: any) {
    try {
        const user = verifyToken(event); // se falhar, já lança erro
        const users = await getAllUsers();
        return {
            statusCode: 200,
            body: JSON.stringify(users),
        };
    } catch (err: any) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
