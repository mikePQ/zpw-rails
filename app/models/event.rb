class Event < ApplicationRecord
  has_many :tickets

  def name
    artist.to_s + ' - ' + event_date.to_s
  end

  def seats
    seats_arr = []
    for i in 1..seats_rows do
      for j in 1..seats_columns
        seats_arr.push(get_seat(i, j))
      end
    end

    seats_arr
  end

  def is_available(seat)
    tickets.map {|ticket| ticket.seat_id_seq}.include? seat
  end

  def available_seats
    seats.select {|seat| is_available(seat)}
  end

  def get_seat(row, col)
    (64 + row).chr + col.to_s
  end

  def seats_rows
    8
  end

  def seats_columns
    15
  end
end
