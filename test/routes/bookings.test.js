const { bookRoom, getBookingDetails, getCurrentGuests, cancelBooking, modifyBooking } = require("../../controllers/bookings");


describe('Hotel Booking System API Tests', () => {
    // Sample test data
    const testBooking = {
        guestName: "Shubham Kumbhakar",
        email: "shubhamkumbhakar27@gmail.com",
        phone: "8002125543",
        checkInDate: "2025-01-10",
        checkOutDate: "2025-01-30"
    };

    // Sample test database
    let db;

    // Reset the database before each test
    beforeEach(() => {
        // Reset rooms and bookings to initial state
        db = {
            rooms: [
                { roomNumber: 101, type: 'Standard', isOccupied: false },
                { roomNumber: 102, type: 'Standard', isOccupied: false }
            ],
            bookings: []
        };
    });

    describe('Create booking', () => {
        test('should create a new booking successfully', () => {
            const result = bookRoom(db, testBooking);

            expect(result.guestName).toBe(testBooking.guestName);
            expect(result.roomNumber).toBeDefined();
            expect(db.rooms.find(r => r.roomNumber === result.roomNumber).isOccupied).toBe(true);
        });

        test('should fail when no rooms are unavailable', () => {
            // Book all rooms
            db.rooms.forEach(room => room.isOccupied = true);

            try{
                bookRoom(db, testBooking);
            }catch(error){
                expect(error.message).toEqual('No rooms available');
            }
        });

        test('should validate check-in and check-out dates', () => {
            const invalidBooking = {
                ...testBooking,
                checkInDate: "2025-01-20",
                checkOutDate: "2025-01-15"
            };

            try{
                bookRoom(db, invalidBooking);
            } catch (error){
                expect(error.message).toBe('Check-out date must be after check-in date');
            }
        });
    })

    describe('Get guest details by email', () => {
        test('should retrieve booking details successfully', () => {
            bookRoom(db, testBooking);

            const result = getBookingDetails(db, testBooking.email);

            expect(result.guestName).toBe(testBooking.guestName);
            expect(result.email).toBe(testBooking.email);
            expect(result.phone).toBe(testBooking.phone);
        });

        test('should return undefined for non-existent booking', () => {
            const result = getBookingDetails(db, 'nonexistent@example.com');

            expect(result).toBeUndefined();
        });
    });


    describe('Get all current guests', () => {
        test('should list all current guests', () => {
            bookRoom(db, testBooking);

            const result = getCurrentGuests(db);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty('guestName');
            expect(result[0]).toHaveProperty('roomNumber');
        });

        test('should return empty array when no current guests', () => {
            const result = getCurrentGuests(db);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe('Cancel booking', () => {
        test('should cancel booking successfully', () => {
            // Create a booking first
            const booking = bookRoom(db, testBooking);

            cancelBooking(db, testBooking.email, booking.roomNumber);
            
            // Verify room is now available
            const room = db.rooms.find(r => r.roomNumber === booking.roomNumber);
            expect(room.isOccupied).toBe(false);
        });

        test('should return error for non-existent booking cancellation', () => {
            try{
                cancelBooking(db, 'nonexistent@example.com','101');
            }catch(error){
                expect(error.message).toBe('Booking not found');
            }           
        });
    });

    describe('Modify booking', () => {
        test('should modify booking dates successfully', () => {
            const booking = bookRoom(db, testBooking);

            const result = modifyBooking(db, {
                email: testBooking.email,
                roomNumber: booking.roomNumber,
                newCheckInDate: "2025-02-01",
                newCheckOutDate: "2025-02-05"
            });

            expect(result.checkInDate).toBeDefined();
            expect(result.checkOutDate).toBeDefined();

            expect(new Date(result.checkInDate).getTime()).toBe(new Date("2025-02-01").getTime());
            expect(new Date(result.checkOutDate).getTime()).toBe(new Date("2025-02-05").getTime());
        });

        test('should validate new dates when modifying booking', () => {
            const booking = bookRoom(db, testBooking);

            try{
                modifyBooking(db, {
                    email: testBooking.email,
                    roomNumber: booking.roomNumber,
                    newCheckInDate: "2025-02-05",
                    newCheckOutDate: "2025-02-01"
                });
            }catch(error){
                expect(error.message).toBe('Check-out date must be after check-in date');
            }
            
        });
    });

})