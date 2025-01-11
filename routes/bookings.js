const { db } = require("../database");
const express = require('express');
const { bookRoom, getBookingDetails, getCurrentGuests, cancelBooking, modifyBooking } = require('../controllers/bookings');
const router = express();

function safeParseBook(body){
    if(!body.guest_name || !body.email || !body.phone || !body.check_in_date || !body.check_out_date){
        return {
            success: false
        }
    }
    return {
        success: true,
        body: {
            guestName: body.guest_name,
            email: body.email,
            phone: body.phone,
            checkInDate: body.check_in_date,
            checkOutDate: body.check_out_date
        }
    }
}

function safeParseCancel(body){
    if(!body.email || !body.room_number){
        return {
            success: false
        }
    }

    return {
        success: true,
        body: {
            email: body.email,
            roomNumber: body.room_number
        }
    }
}

function safeParseModify(body){
    if(!body.email || !body.room_number || !body.new_check_in_date || !body.new_check_out_date){
        return {
            success: false
        }
    }

    return {
        success: true,
        body: {
            email: body.email,
            roomNumber: body.room_number,
            newCheckInDate: body.new_check_in_date,
            newCheckOutDate: body.new_check_out_date
        }
    }
}


// 1. Booking Room API
router.post("/book", (req, res)=>{
    try{
        const parsed = safeParseBook(req.body);
        if(!parsed.success){
            res.status(400).json({ error: 'Invalid request body' });
        }

        const bookingDetails = bookRoom(db, parsed.body);
        res.json({
            message: 'Booking confirmed',
            bookingDetails
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

// 2. View Booking Details API
router.get('/guests/:email', (req, res) => {
    try {
        const booking = getBookingDetails(db, req.params.email);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. View All Guests in the Hotel API
router.get('/guests', (req, res) => {
    try {
        const currentGuests = getCurrentGuests(db);

        res.json({
            guests: currentGuests
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Cancel Room Booking API
router.put('/cancel', (req, res) => {
    try {
        const parsed = safeParseCancel(req.body);
        const { email, roomNumber } = parsed.body;
        cancelBooking(db, email, roomNumber);

        res.json({ message: 'Booking cancelled successfully', room_number: roomNumber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Modify Booking API
router.put('/modify', (req, res) => {
    try {
        const parsed = safeParseModify(req.body);
        if(!parsed.success){
            res.status(400).json({ error: 'Invalid request body' });
        }


        const updatedBooking = modifyBooking(db, parsed.body);

        res.json({
            message: 'Booking modified successfully',
            updatedBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// route to check current db state directly
router.get("/db", (req, res) => {
    res.json({db});
})

module.exports = router;