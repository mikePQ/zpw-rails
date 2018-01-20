module TicketsHelper
  def user_tickets(tickets)
    if current_user&.admin?
      return tickets
    end
    tickets.select {|ticket| ticket.user_id == current_user.id}
  end

  def ticket_price(event_id)
    event = Event.find(event_id)
    date = event.event_date
    today = Date.today

    if today >= date
      return 1.2 * event.price_high
    end

    days = (date - today).to_i

    if days >= 25
      price = event.price_low
    elsif days >= 15
      price = (event.price_low + event.price_high) / 2
    elsif days >= 7
      price = (event.price_low + 3 * event.price_high) / 4
    else
      price = event.price_high
    end

    price
  end

  def total_price(seats)
    event_id = params[:event_id]
    seats.length * ticket_price(event_id)
  end

  def get_amount_to_return(ticket)
    event = Event.find(ticket.event_id)
    date = event.event_date
    today = Date.today

    if today >= date
      return 0.4 * ticket.price
    end

    days = (date - today).to_i

    if days >= 25
      to_return = 0.9 * ticket.price
    elsif days >= 15
      to_return = 0.8 * ticket.price
    elsif days >= 7
      to_return = 0.7 * ticket.price
    else
      to_return = 0.55 * ticket.price
    end

    to_return
  end

  def not_returned(tickets)
    tickets.select {|ticket| !ticket.returned}
  end

  def returned(tickets)
    tickets.select {|ticket| ticket.returned}
  end
end
