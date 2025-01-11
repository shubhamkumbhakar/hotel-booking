function bookRoom( db, bookingDetails ){
    const { 
        guestName, 
        email, 
        phone, 
        checkInDate, 
        checkOutDate 
    } = bookingDetails;


    // Validate dates
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        throw new Error("Check-out date must be after check-in date");
    }

    // Find available room
    const availableRoom = db.rooms.find(room => !room.isOccupied);
    if ( !availableRoom ) {
        throw new Error("No rooms available");
    }

    // Create booking
    const booking = {
        guestName,
        email,
        phone,
        roomNumber: availableRoom.roomNumber,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        status: 'confirmed'
    };

    // insert new booking 
    db.bookings.push( booking );

    // Update room status
    availableRoom.isOccupied = true;

    return {
        guestName,
        roomNumber: availableRoom.roomNumber,
        checkInDate,
        checkOutDate
    }

}


function getBookingDetails(db, email){
    return db.bookings.find(booking => 
        booking.email === email && 
        booking.status === 'confirmed'
    );
}

function getCurrentGuests(db){
    const currentDate = new Date();
    const currentGuests = db.bookings.filter(booking => 
        booking.checkInDate <= currentDate &&
        booking.checkOutDate >= currentDate &&
        booking.status === 'confirmed'
    );

    return currentGuests.map(guest => ({
        guestName: guest.guestName,
        roomNumber: guest.roomNumber
    }));
}

function cancelBooking(db, email, roomNumber){
    const bookingIndex = db.bookings.findIndex(booking => 
        booking.email === email &&
        booking.roomNumber === roomNumber &&
        booking.status === 'confirmed'
    );

    if (bookingIndex === -1) {
        throw new Error('Booking not found');
    }

    // Update booking status
    db.bookings[bookingIndex].status = 'cancelled';

    // Update room status
    const room = db.rooms.find(room => room.roomNumber === roomNumber);
    if (room) {
        room.isOccupied = false;
    }
}

function modifyBooking(db, newDetails){
    const { email, roomNumber, newCheckInDate, newCheckOutDate } = newDetails;

    // Validate new dates
    if (new Date(newCheckInDate) >= new Date(newCheckOutDate)) {
        throw new Error('Check-out date must be after check-in date');
    }

    const bookingIndex = db.bookings.findIndex(booking =>
        booking.email === email &&
        booking.roomNumber === roomNumber &&
        booking.status === 'confirmed'
    );

    if (bookingIndex === -1) {
        throw new Error('Booking not found');
    }

    // Update booking dates
    db.bookings[bookingIndex].checkInDate = new Date(newCheckInDate);
    db.bookings[bookingIndex].checkOutDate = new Date(newCheckOutDate);

    return db.bookings[bookingIndex];
}

module.exports = { bookRoom, getBookingDetails, getCurrentGuests, cancelBooking, modifyBooking };