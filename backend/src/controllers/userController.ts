import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createUser, getUserByEmail, getAllUsers } from "../services/userService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyToken } from '../middlewares/authMiddleware';


export const registerUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || "{}");

        let name = "";
        let email = "";
        let password = "";
        let company = "";

        if ("eventType" in body && body.eventType === "FORM_RESPONSE") {
            const fields = body.data?.fields || [];

            const normalize = (str: string) => str?.trim().toLowerCase();

            const getFieldValue = (label: string) => {
                const field = fields.find((f: any) => normalize(f.label) === normalize(label));

                if (!field) return null;

                if (field.type === "MULTIPLE_CHOICE") {
                    const selectedId = field.value?.[0];
                    const selectedOption = field.options?.find((opt: any) => opt.id === selectedId);
                    return selectedOption?.text || selectedId;
                }

                return field.value;
            };

            name = getFieldValue("Nome");
            email = getFieldValue("Email");
            password = getFieldValue("Senha");
            company = getFieldValue("Qual sua empresa?");
        } else {
            // Primeiro formato
            name = body.name;
            email = body.email;
            password = body.password;
            company = body.company;
        }

        if (!name || !email || !password || !company) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Campos obrigatórios ausentes" }),
            };
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Usuário já existe" }),
            };
        }

        const user = await createUser(name, email, password, company);

        return {
            statusCode: 201,
            body: JSON.stringify({ id: user.id, name, email, company }),
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

export async function getUser(event: any) {
    try {
        const user = verifyToken(event); // valida o token, lança erro se inválido

        const email = event.queryStringParameters?.email;
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Email é obrigatório na query string" }),
            };
        }

        const foundUser = await getUserByEmail(email);

        if (!foundUser) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Usuário não encontrado" }),
            };
        }

        // nunca retornar a senha!
        const { password, ...safeUser } = foundUser;

        return {
            statusCode: 200,
            body: JSON.stringify(safeUser),
        };
    } catch (err: any) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: err.message }),
        };
    }
}

