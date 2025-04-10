import { APIGatewayProxyHandler } from "aws-lambda";
import { uploadPdf } from "../services/uploadService";

export const upload: APIGatewayProxyHandler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");

        if (!body.file || !body.fileName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Arquivo e nome são obrigatórios." }),
            };
        }

        const buffer = Buffer.from(body.file, "base64");
        const url = await uploadPdf(buffer, body.fileName);

        return {
            statusCode: 200,
            body: JSON.stringify({ url }),
        };
    } catch (error) {
        console.error("Erro no upload:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro interno no servidor." }),
        };
    }
};
