const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bookingRoutes = require("./routes/bookings");

app.use(bodyParser.json());

app.get("/health", (req, res) => {
    res.json({
        status: 200,
        message: "server running"
    })
})

app.use("/api/bookings", bookingRoutes);

const port = process.env.PORT || 5001;
app.listen(port, ()=>{
    console.log(`Server up: ${port}`);
});