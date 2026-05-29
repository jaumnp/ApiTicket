export function validateRequired(body, fields) {
    if (!body) return { isValid: false, message: "Corpo da requisição inválido ou vazio." };

    const missingFields = fields.filter(field => !body[field] || body[field].trim() === "");

    if (missingFields.length > 0) {
        return { 
            isValid: false, 
            message: "Campos obrigatórios faltando"
        };
    }

    return { isValid: true };
}