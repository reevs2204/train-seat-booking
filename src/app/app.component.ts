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
  seats: Seat[] = [];
  requestedSeats: number;
  selectedSeats: Seat[] = [];

  ngOnInit() {
    this.initializeSeats();
  }

  initializeSeats() {
    let seatId = 1;
    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 12 ? 3 : 7;
      for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
        this.seats.push({
          seatId: seatId++,
          rowNumber: row,
          seatNumberInRow: seatNum,
          isBooked: false,
        });
      }
    }
    this.bookInitialSeats([5, 15, 25, 35, 45, 55, 65, 75]); // Pre-booked seats
  }

  bookInitialSeats(seatIds: number[]) {
    seatIds.forEach((id) => {
      const seat = this.seats.find((s) => s.seatId === id);
      if (seat) {
        seat.isBooked = true;
      }
    });
  }

  getRows() {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  getSeatsInRow(rowNumber: number) {
    return this.seats.filter((seat) => seat.rowNumber === rowNumber);
  }

  bookSeats(requestedSeats: number) {
    if (requestedSeats < 1 || requestedSeats > 7) {
      alert('You can reserve between 1 and 7 seats at a time.');
      return;
    }

    let availableSeats = this.findSeatsInSameRow(requestedSeats);

    if (!availableSeats.length) {
      availableSeats = this.findNearbySeats(requestedSeats);
    }

    if (availableSeats.length) {
      availableSeats.forEach((seat) => (seat.isBooked = true));
      this.selectedSeats = availableSeats;
      alert(
        `Booked seats: ${availableSeats.map((seat) => seat.seatId).join(', ')}`
      );
    } else {
      alert('Not enough seats available to fulfill your request.');
    }
  }

  findSeatsInSameRow(requestedSeats: number): Seat[] {
    for (let row = 1; row <= 12; row++) {
      const seatsInRow = row === 12 ? 3 : 7;
      const rowSeats = this.seats.filter(
        (seat) => seat.rowNumber === row && !seat.isBooked
      );

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
    const availableSeats = this.seats.filter((seat) => !seat.isBooked);
    return availableSeats.slice(0, requestedSeats);
  }
}
