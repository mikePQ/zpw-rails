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

  def total_price(tickets)
    100 #TODO implement
  end

  def create_tickets(params)
    seats = params[:seat_ids]
    print seats

    event = params[:event_id]
    print event

    seats
  end
end
