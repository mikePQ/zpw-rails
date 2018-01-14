class Event < ApplicationRecord
  has_many :tickets

  def name
    artist.to_s + ' - ' + event_date.to_s
  end
end
