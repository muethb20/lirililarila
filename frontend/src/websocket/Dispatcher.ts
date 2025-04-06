import {useTicketStore} from "@/store/TicketStore.ts";
import {IUser} from "@/models/User.model.ts";
import {ITicket} from "@/models/Ticket.model.ts";
import {IMessage} from "@/models/IMessage.ts";


class Dispatcher {

    static dispatch(message: IMessage) {

        const ticketStore = useTicketStore.getState();

        switch (message.type) {
            case "LOGIN":
                {
                    const newUser = message.payload as IUser;
                    ticketStore.setUser({...newUser});
                    break;
                }

            case "LOGOUT":
                ticketStore.setUser(undefined);
                break;

            case "ADMIN_LIST":
                ticketStore.setAdmins(message.payload as IUser[]);
                break;

            case "TICKET_LIST":
                ticketStore.setTickets(message.payload as ITicket[]);
                break;

            default:
                console.log(`Type ${message.type} invalid`);
                break;
        }
    }
}

export default Dispatcher;