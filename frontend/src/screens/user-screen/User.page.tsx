
import {useEffect, useState} from "react"
import { Filter, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {useTicketStore} from "@/store/TicketStore.ts";
import {ITicket} from "@/models/Ticket.model.ts";

export default function UserPage() {
    const [ticketList, setTickets] = useState<ITicket[]>([
        {
            id: "TKT-002",
            title: "Request for new software",
            type: "General",
            status: "In Progress",
            createdDate:  "2023-05-02",
            createdUserMail: "",
            description: "",
            assignedAdmin: ""
        },
        {
            id: "TKT-004",
            title: "New employee onboarding",
            type: "Organizational",
            status: "Open",
            createdDate:  "2023-05-02",
            createdUserMail: "",
            description: "",
            assignedAdmin: ""
        },
    ])

    const [typeFilter, setTypeFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTicket, setNewTicket] = useState({
        title: "",
        type: "",
        description: "",
    })

    const {user, tickets} = useTicketStore()

    useEffect(() => {
        setTickets(tickets);
    }, []);

    const filteredTickets = ticketList.filter((ticket) => {
        const matchesType = typeFilter ? ticket.type === typeFilter : true
        const matchesStatus = statusFilter ? ticket.status === statusFilter : true
        const matchesSearch = searchQuery
            ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        return matchesType && matchesStatus && matchesSearch
    })

    const handleCreateTicket = () => {
        if (!newTicket.title || !newTicket.type) return

        const today = new Date().toISOString().split("T")[0]
        const newId = `TKT-${String(ticketList.length + 1).padStart(3, "0")}`

        const ticketToAdd: ITicket = {
            id: newId,
            title: newTicket.title,
            type: newTicket.type,
            status: "Open",
            createdDate: today,
            createdUserMail: "",
            assignedAdmin: "",
            description: newTicket.description,
        }


        setTickets([...tickets, ticketToAdd])
        setNewTicket({ title: "", type: "", description: "" })
        setIsDialogOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-gray-800">TicketSystem</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a
                                    href="#"
                                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    My Tickets
                                </a>
                                <a
                                    href="#"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Create Ticket
                                </a>
                                <a
                                    href="#"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Profile
                                </a>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="ml-3 relative">
                                <div>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.firstname} {user?.lastname}!
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">Here's an overview of your tickets and recent updates.</p>
                    </div>

                    <div className="px-4 sm:px-0 mb-6">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Create New Ticket
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Ticket</DialogTitle>
                                    <DialogDescription>Fill in the details to create a new support ticket.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={newTicket.title}
                                            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">
                                            Type
                                        </Label>
                                        <Select
                                            value={newTicket.type}
                                            onValueChange={(value) => setNewTicket({ ...newTicket, type: value })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select ticket type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Technical">Technical</SelectItem>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Organizational">Organizational</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="description" className="text-right">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            value={newTicket.description}
                                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleCreateTicket}>
                                        Create Ticket
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Tickets Tab */}
                    <Tabs defaultValue="tickets" className="w-full">
                        <TabsList>
                            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tickets">
                            {/* Filters and Search */}
                            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Technical">Technical</SelectItem>
                                            <SelectItem value="General">General</SelectItem>
                                            <SelectItem value="Organizational">Organizational</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setTypeFilter("")
                                            setStatusFilter("")
                                            setSearchQuery("")
                                        }}
                                    >
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        className="pl-10"
                                        placeholder="Search tickets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Tickets List */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map((ticket) => (
                                        <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>
                                                    <strong>ID:</strong> {ticket.id}
                                                </p>
                                                <p>
                                                    <strong>Type:</strong> {ticket.type}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong> {ticket.status}
                                                </p>
                                                <p>
                                                    <strong>Last Updated:</strong> {ticket.createdDate}
                                                </p>
                                                {ticket.description && (
                                                    <p className="mt-2">
                                                        <strong>Description:</strong> {ticket.description}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-10">
                                        <p className="text-gray-500">No tickets match your filters. Try adjusting your search criteria.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-md mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-700">
                                Support
                            </a>
                            <a href="#" className="hover:text-gray-700">
                                Terms of Service
                            </a>
                        </div>
                        <div>Version: 1.0.0</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}