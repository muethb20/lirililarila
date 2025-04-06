export interface ITicket {
    createdUserMail: string,
    id: string
    title: string
    type: string
    status: string
    assignedAdmin: string
    createdDate: string
    description?: string
}