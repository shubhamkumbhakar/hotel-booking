const db = {
    rooms: [
        { roomNumber: 101, type: 'Standard', isOccupied: false },
        { roomNumber: 102, type: 'Standard', isOccupied: false },
        { roomNumber: 103, type: 'Deluxe', isOccupied: false },
        { roomNumber: 104, type: 'Deluxe', isOccupied: false },
        { roomNumber: 105, type: 'Suite', isOccupied: false }
    ],
    bookings: []
};

module.exports = { db };