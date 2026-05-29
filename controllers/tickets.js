import { randomUUID } from "crypto";
import { validateRequired } from "../utils/validator.js";

async function getTicketsList({ req, res, db }){
    try {
        let tickets = await db.getAll();

        const filterParam = req.params?.idStatus;

        if (filterParam) {
            tickets = tickets.filter(ticket => filterParam.length > 20 ? ticket.id === filterParam : ticket.status === filterParam );
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(tickets));

    } catch (error) {
        console.log("Erro ao carregar tickets:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno ao carregar os tickets, tente mais tarde!" }));
        }
    }
}

async function createTicket({ req, res, db }){
    const validation = validateRequired(req.body, ['equipment', 'description', 'user_name']);
    if (!validation.isValid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: validation.message }));
    }

    const { equipment, description, user_name } = req.body;

    const ticket = {
        id: randomUUID(),
        equipment,
        description,
        user_name,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    try {
        await db.insert(ticket);
        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Sucesso" }));
    } catch (error) {
        console.log("Erro ao salvar ticket:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno ao criar ticket, tente mais tarde!" }));
        }
    }
}

async function updateTicket({ req, res, db }){
    const id = req.params?.id;

    if (!id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "O ID do ticket é obrigatório!" }));
    }

    const validation = validateRequired(req.body, ["equipment", "description"]);
    if (!validation.isValid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: validation.message }));
    }

    const updates = {};
    const { equipment, description } = req.body;

    if(equipment) updates["equipment"] = equipment
    if(description) updates["description"] = description

    try {
        const updatedTicket = await db.update(id, updates);

        if (!updatedTicket) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Ticket não encontrado." }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Ticket atualizado com sucesso!", ticket: updatedTicket }));
    } catch (error) {
        console.log("Erro ao atualizar o ticket:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno ao atualizar o ticket, tente mais tarde!" }));
        }
    }
}

async function closeTicket({ req, res, db }) {
    const id = req.params?.id;

    if (!id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "O ID do ticket é obrigatório!" }));
    }

    try {
        const closedTicket = await db.update(id, { status: "closed" });

        if (!closedTicket) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Ticket não encontrado." }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Ticket fechado com sucesso!", ticket: closedTicket })); 
    } catch (error) {
        console.log("Erro ao atualizar o ticket:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno ao fechar o ticket, tente mais tarde!" }));
        }
    }
}

async function deleteTicket({ req, res, db }){
    const id = req.params?.id;

    if (!id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "O ID do ticket é obrigatório!" }));
    }

    try {
        const ticketDeleted = await db.remove(id);

        if (!ticketDeleted) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Ticket não encontrado." }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Ticket deletado com sucesso!" }));

    } catch (error) {
        console.log("Erro ao deletar o ticket:", error);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Erro interno ao deletar o ticket, tente mais tarde!" }));
        }
    }
}

export {
    getTicketsList,
    createTicket,
    updateTicket,
    closeTicket,
    deleteTicket
}