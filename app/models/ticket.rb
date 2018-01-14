class Ticket < ApplicationRecord
  belongs_to :event
  belongs_to :user

  validates :name, :presence => true,
            :length => {:minimum => 6}
  validates :email_address, :presence => true
  validates :price, :presence => true

  #TODO validation for other fields
end
