import { routesParse } from "./utils/routesParse.js";
import { getTicketsList, createTicket, updateTicket, closeTicket, deleteTicket } from "./controllers/tickets.js";

export const routes = [
    {
        path: "/tickets/:idStatus",
        method: "GET",
        controller: getTicketsList
    },
    {
        path: "/tickets",
        method: "GET",
        controller: getTicketsList
    },
    {
        path: "/tickets",
        method: "POST",
        controller: createTicket
    },
    {
        path: "/tickets/:id",
        method: "PUT",
        controller: updateTicket
    },
    {
        path: "/tickets/:id/close",
        method: "PATCH",
        controller: closeTicket
    },
    {
        path: "/tickets/:id",
        method: "DELETE",
        controller: deleteTicket
    },
].map(route => {
    return {
        ...route,
        path: routesParse(route.path)
    }
});