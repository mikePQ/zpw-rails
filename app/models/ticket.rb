class Ticket < ApplicationRecord
  belongs_to :event
  belongs_to :user

  validates :name, :presence => true,
            :length => {:minimum => 5}
  validates :email_address, :presence => true,
            :length => {:minimum => 5}
  validates :price, :presence => true
  validates :seat_id_seq, :presence => true
  validates :event_id, :presence => true
  validates :phone, :presence => true,
            :length => {:minimum => 9, :maximum => 9}
  validates :address, :presence => true,
            :length => {:minimum => 10}

  def self.search(artist)
    if artist
      Ticket.joins(:event).where('artist LIKE ?', "%#{artist}%")
    else
      Ticket.joins(:event)
    end
  end

  def self.filter(start_date, end_date)
    if start_date.to_s.empty?
      return end_date.to_s.empty? ? Ticket.joins(:event) : Ticket.joins(:event).where("event_date <= :end_date", {end_date: end_date})
    else
      return end_date.to_s.empty? ? Ticket.joins(:event).where("event_date >= :start_date", {start_date: start_date}) :
                 Ticket.joins(:event).where("event_date >= :start_date AND event_date <= :end_date", {start_date: start_date, end_date: end_date})
    end
  end
end
