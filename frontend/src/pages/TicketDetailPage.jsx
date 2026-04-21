import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTickets } from '../api/ticketApi';
import TicketStatusStepper from '../components/TicketStatusStepper';

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadTicket = async () => {
            try {
                setLoading(true);
                const res = await getAllTickets();
                console.log("Full API Response:", res); // Debugging සඳහා

                // දත්ත ලබාගැනීම (Array එකක්ද නැද්ද යන්න පරීක්ෂා කිරීම)
                const ticketsList = Array.isArray(res) ? res : (res?.data || []);

                if (isMounted) {
                    const found = ticketsList.find(t => String(t.id) === String(id));
                    if (found) {
                        setTicket(found);
                        setError(null);
                    } else {
                        setError(`Ticket ID ${id} not found.`);
                    }
                }
            } catch (err) {
                console.error("Fetch Error Details:", err);
                if (isMounted) {
                    // CORS Error එකක්ද කියලා බලන්න
                    if (err.message === "Network Error") {
                        setError("Network Error: Please check if Backend is running and CORS is enabled.");
                    } else {
                        setError("Failed to load ticket details.");
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadTicket();
        return () => { isMounted = false; };
    }, [id]);

    if (loading) return <div className="text-center p-10"><h1>⌛ Loading...</h1></div>;
    
    if (error) return (
        <div className="text-center p-10">
            <h2 className="text-red-500">🚫 {error}</h2>
            <button 
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Back to Dashboard
            </button>
        </div>
    );

    return (
        <div className="page p-6 max-w-4xl mx-auto">
            <button onClick={() => navigate('/')} className="mb-6 text-blue-600 hover:underline">
                ← Back to All Tickets
            </button>

            <div className="bg-white rounded-3xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-left">Ticket Details</h1>
                
                {/* Stepper */}
                <div className="mb-10">
                    <TicketStatusStepper currentStatus={ticket?.status || 'OPEN'} />
                </div>

                <div className="space-y-4 text-left border-t pt-6">
                    <p><strong>ID:</strong> {ticket?.id}</p>
                    <p><strong>Resource:</strong> {ticket?.resourceId}</p>
                    <p><strong>Category:</strong> {ticket?.category}</p>
                    <p><strong>Priority:</strong> {ticket?.priority}</p>
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <strong>Description:</strong>
                        <p className="mt-2 text-slate-600">{ticket?.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
