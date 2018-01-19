module TicketsHelper
  def user_tickets(tickets)
    if current_user&.admin?
      return tickets
    end
    tickets.select {|ticket| ticket.user_id == current_user.id}
  end

  def ticket_price(event_id)
    100 #TODO
  end

  def total_price(seats)
    event_id = params[:event_id]
    seats.length * ticket_price(event_id)
  end
end
