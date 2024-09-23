import { Component, OnInit } from '@angular/core';

interface Seat {
  seatId: number;
  rowNumber: number;
  seatNumberInRow: number;
  isBooked: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  seats: Seat[] = [];  // List of all seats
  requestedSeats: number;  // Number of seats requested by the user
  selectedSeats: Seat[] = [];  // Seats selected by the user

  ngOnInit() {
    this.initializeSeats();  // Initialize seats on component load
  }

  initializeSeats() {
    let seatId = 1;
    // Loop through 12 rows to create seats
    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 12 ? 3 : 7;  // Last row has 3 seats, others have 7
      for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
        this.seats.push({
          seatId: seatId++,
          rowNumber: row,
          seatNumberInRow: seatNum,
          isBooked: false,  // Default all seats as unbooked
        });
      }
    }
    this.bookInitialSeats([5, 15, 25, 35, 45, 55, 65, 75]);  // Pre-book certain seats
  }

  bookInitialSeats(seatIds: number[]) {
    // Mark specified seat IDs as booked
    seatIds.forEach((id) => {
      const seat = this.seats.find((s) => s.seatId === id);
      if (seat) {
        seat.isBooked = true;
      }
    });
  }

  getRows() {
    return Array.from({ length: 12 }, (_, i) => i + 1);  // Return array for 12 rows
  }

  getSeatsInRow(rowNumber: number) {
    return this.seats.filter((seat) => seat.rowNumber === rowNumber);  // Get seats in a specific row
  }

  bookSeats(requestedSeats: number) {
    // Validate seat request (1-7 seats only)
    if (requestedSeats < 1 || requestedSeats > 7) {
      alert('You can reserve between 1 and 7 seats at a time.');
      return;
    }

    // Try to find seats in the same row first
    let availableSeats = this.findSeatsInSameRow(requestedSeats);

    // If no seats in the same row, find nearby seats
    if (!availableSeats.length) {
      availableSeats = this.findNearbySeats(requestedSeats);
    }

    // Book seats if available
    if (availableSeats.length) {
      availableSeats.forEach((seat) => (seat.isBooked = true));
      this.selectedSeats = availableSeats;
      alert(`Booked seats: ${availableSeats.map((seat) => seat.seatId).join(', ')}`);
    } else {
      alert('Not enough seats available to fulfill your request.');
    }
  }

  findSeatsInSameRow(requestedSeats: number): Seat[] {
    // Check each row for consecutive available seats
    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 12 ? 3 : 7;
      const rowSeats = this.seats.filter(
        (seat) => seat.rowNumber === row && !seat.isBooked
      );

      // Find a block of available seats in the row
      for (let i = 0; i <= seatsInRow - requestedSeats; i++) {
        const group = rowSeats.slice(i, i + requestedSeats);
        if (group.length === requestedSeats) {
          return group;
        }
      }
    }
    return [];
  }

  findNearbySeats(requestedSeats: number): Seat[] {
    // Find nearest available seats if not enough in a single row
    const availableSeats = this.seats.filter((seat) => !seat.isBooked);
    return availableSeats.slice(0, requestedSeats);
  }
}
