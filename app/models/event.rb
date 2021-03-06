class Event < ApplicationRecord
  has_many :tickets

  validates :artist, :presence => {:message => 'Imię i nazwisko artysty musi jest wymagane'}

  validates :artist, :length => {:minimum => 5,
                                 :message => 'Imię i nazwisko artysty musi zawierać co najmniej 5 znaków'}

  validates :description, :presence => {:message => 'Opis wydarzenia jest wymagany'}

  validates :description, :length => {:minimum => 20,
                                      :message => 'Opis wydarzenia musi zawierać co najmniej 20 znaków'}

  validates :price_low, :presence => {:message => 'Cena minimalna jest wymagana'}
  validates :price_high, :presence => {:message => 'Cena maksymalna jest wymagana'}

  validates :event_date, :presence => {:message => 'Data wydarzenia jest wymagana'}
  validates :event_date, :date => true

  validates :seats_rows, :presence => {:message => 'Ilość rzędów jest wymagana'}
  validates :seats_columns, :presence => {:message => 'Ilość kolumn w rzędzie jest wymagana'}

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
    !tickets.map {|ticket| ticket.seat_id_seq}.include? seat
  end

  def available_seats
    seats.select {|seat| is_available(seat)}
  end

  def get_seat(row, col)
    (64 + row).chr + col.to_s
  end

  def self.search(search)
    if search
      where('artist LIKE ?', "%#{search}%")
    else
      all
    end
  end

  def self.filter(start_date, end_date)
    if start_date.to_s.empty?
      return end_date.to_s.empty? ? all : where("event_date <= :end_date", {end_date: end_date})
    else
      return end_date.to_s.empty? ? where("event_date >= :start_date", {start_date: start_date}) :
                 where("event_date >= :start_date AND event_date <= :end_date", {start_date: start_date, end_date: end_date})
    end
  end
end
