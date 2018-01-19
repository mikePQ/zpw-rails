class AccountCharge
  include ActiveModel::Model

  validates :amount, :presence => {:message => 'Proszę podać kwotę doładowania'}
  validates :check_code, :presence => {:message => 'Proszę podać kod potwierdzający'}
  validates :check_code, :format => {:with => /[A-Z]{3}\d{2}[a-z]{3}/i, :message => 'Nieprawidłowy kod'}

  attr_accessor :amount, :check_code
end