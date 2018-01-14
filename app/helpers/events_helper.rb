module EventsHelper
  def format_date(date)
    date.strftime("%H:%M %d/%m/%Y")
  end
end

