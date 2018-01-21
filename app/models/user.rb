class User < ApplicationRecord
  has_many :tickets

  before_save {
    self.email = email.downcase
  }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true
  validates :email, length: {maximum: 255}
  validates :email, format: {with: VALID_EMAIL_REGEX, message: 'Nieprawidłowy email'}
  validates :email, uniqueness: {case_sensitive: false, message: 'Podany email jest już zarejestrowany'}

  has_secure_password({message: 'Nieprawidłowe hasło'})

  validates :password, presence: {message: 'Proszę podać hasło'}
  validates :password, length: {minimum: 7, maximum: 255, message: 'Hasło powinno zawierać pomiędzy 7 a 255 znaków'}
end
