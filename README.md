# Hotel Room Booking System

Postman collection for all the following APIs: https://app.getpostman.com/join-team?invite_code=4e25278f540f087d62fee84f6238fab56fdf429341596457eca92a72623ed148&target_code=a255da7d7d32f9ae0432400f29a89260

# Install Dependencies: `npm i`
# Start server by running : `node index`
# Running Jest unit tests: `npm test`

# APIs:

# 1. Booking Room API:
    - Users can book a room by providing their name, contact details, check-in date, and check-out date.
      API URL: http://localhost:5001/api/bookings/book
      Method: POST
      Test Body: {
          "guest_name": "Shubham Kumbhakar",
          "email": "shubhamkumbhakar27@gmail.com",
          "phone": "8002125543",
          "check_in_date": "2025-01-11",
          "check_out_date": "2025-01-13"
      }
    
# 2. View Booking Details API:
    - Retrieve the details of a guest&#39;s room booking by providing their email address.
      API URL: http://localhost:5001/api/bookings/guests/shubhamkumbhakar27@gmail.com
      Method: GET

# 3. View All Guests in the Hotel API:
    - Return a list of all the guests currently staying in the hotel, including
    their room numbers.
      API URL: http://localhost:5001/api/bookings/guests
      Method: GET
    
# 4. Cancel Room Booking API:
    -Allow a guest to cancel their booking by providing their email and room
    details.
      API URL: http://localhost:5001/api/bookings/cancel
      Method: PUT
      Test Body: {
          "email": "shubhamkumbhakar27@gmail.com",
          "room_number": 101
      }

# 5. Modify Booking API:
    - Allow a guest to modify their check-in or check-out date by providing
    their email and booking details.
      API URL: http://localhost:5001/api/bookings/modify
      Method: PUT
      Test Body: {
          "email": "shubhamkumbhakar27@gmail.com",
          "room_number": 101,
          "new_check_in_date": "2025-01-15",
          "new_check_out_date": "2025-01-19"
      }


