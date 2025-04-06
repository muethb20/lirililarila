"use client"

import {useEffect, useState} from "react"
import { Bell, ChevronDown, Filter, Search, Edit, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {useTicketStore} from "@/store/TicketStore.ts";

// Define ticket type
type Ticket = {
    id: string
    title: string
    type: string
    status: string
    assignedAdmin: string
    createdDate: string
    description?: string
}

// Define admin type
type Admin = {
    id: string
    name: string
}

export default function AdminPage() {

    const ticketStore = useTicketStore();

    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        setTickets(useTicketStore.getState().tickets);
        console.log(tickets);
    }, [useTicketStore.getState().tickets])

    // Available admins
    const [admins] = useState<Admin[]>([
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Mike Johnson" },
        { id: "4", name: "Sarah Williams" },
    ])

    // State for filters and editing
    const [typeFilter, setTypeFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [activeNavItem, setActiveNavItem] = useState("Open Tickets")

    // Filter tickets based on selected filters and search query
    const filteredTickets = tickets.filter((ticket) => {
        const matchesType = typeFilter ? ticket.type === typeFilter || typeFilter === "all" : true
        const matchesStatus = statusFilter ? ticket.status === statusFilter || statusFilter === "all" : true
        const matchesSearch = searchQuery
            ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        // Filter by navigation selection
        const matchesNavigation =
            activeNavItem === "Dashboard"
                ? true
                : activeNavItem === "Open Tickets"
                    ? ticket.status === "Open"
                    : activeNavItem === "Resolved Tickets"
                        ? ticket.status === "Resolved"
                        : true

        return matchesType && matchesStatus && matchesSearch && matchesNavigation
    })

    // Handle updating a ticket
    const handleUpdateTicket = () => {
        if (!selectedTicket) return

        setTickets(tickets.map((ticket) => (ticket.id === selectedTicket.id ? selectedTicket : ticket)))

        setIsEditDialogOpen(false)
    }

    // Handle assigning a ticket to an admin
    const handleAssignTicket = (adminName: string) => {
        if (!selectedTicket) return

        const updatedTicket = { ...selectedTicket, assignedAdmin: adminName }

        setTickets(tickets.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket)))

        setIsAssignDialogOpen(false)
    }

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            case "In Progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            case "Resolved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Sidebar Navigation */}
            <nav className="w-64 bg-white shadow-md">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <ul className="mt-6">
                    {["Dashboard", "Open Tickets", "Resolved Tickets", "Settings"].map((item, index) => (
                        <li
                            key={index}
                            className={`px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer ${activeNavItem === item ? "bg-gray-100 font-medium" : ""}`}
                            onClick={() => setActiveNavItem(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Ticket Management</h2>
                        <div className="flex items-center space-x-4">
                            <Bell className="h-6 w-6 text-gray-500" />
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">{ticketStore.user?.firstname} {ticketStore.user?.lastname}</span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

                        {/* Tickets Table */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticket ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assigned Admin</TableHead>
                                        <TableHead>Created Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets.length > 0 ? (
                                        filteredTickets.map((ticket) => (
                                            <TableRow key={ticket.id} className="hover:bg-gray-50">
                                                <TableCell>{ticket.id}</TableCell>
                                                <TableCell>{ticket.title}</TableCell>
                                                <TableCell>{ticket.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                                        {ticket.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{ticket.assignedAdmin}</TableCell>
                                                <TableCell>{ticket.createdDate}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedTicket(ticket)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedTicket(ticket)
                                                                setIsAssignDialogOpen(true)
                                                            }}
                                                        >
                                                            <UserPlus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                                No tickets match your filters. Try adjusting your search criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
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
                                    Privacy Policy
                                </a>
                            </div>
                            <div>System Version: 1.0.0</div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Edit Ticket Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Ticket</DialogTitle>
                        <DialogDescription>Update the ticket details and status.</DialogDescription>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ticket-id" className="text-right">
                                    Ticket ID
                                </Label>
                                <Input id="ticket-id" value={selectedTicket.id} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={selectedTicket.title}
                                    onChange={(e) => setSelectedTicket({ ...selectedTicket, title: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <Select
                                    value={selectedTicket.type}
                                    onValueChange={(value) => setSelectedTicket({ ...selectedTicket, type: value })}
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
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    value={selectedTicket.status}
                                    onValueChange={(value) => setSelectedTicket({ ...selectedTicket, status: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={selectedTicket.description || ""}
                                    onChange={(e) => setSelectedTicket({ ...selectedTicket, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdateTicket}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Ticket Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Assign Ticket</DialogTitle>
                        <DialogDescription>Select an admin to assign this ticket to.</DialogDescription>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="py-4">
                            <p className="mb-4">
                                <strong>Ticket:</strong> {selectedTicket.id} - {selectedTicket.title}
                            </p>
                            <p className="mb-4">
                                <strong>Currently assigned to:</strong> {selectedTicket.assignedAdmin}
                            </p>
                            <div className="space-y-2">
                                {admins.map((admin) => (
                                    <Button
                                        key={admin.id}
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => handleAssignTicket(admin.name)}
                                    >
                                        {admin.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

