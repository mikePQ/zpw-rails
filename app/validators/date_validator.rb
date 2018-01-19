class DateValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add(attribute, 'Data wydarzenia nie może być wcześniejsza niż aktualna') if value.past?
  end
end