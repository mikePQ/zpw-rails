module TicketsHelper
  def user_tickets(tickets)
    if current_user&.admin?
      return tickets
    end
    tickets.select {|ticket| ticket.user_id == current_user.id}
  end

  def total_price(tickets)
    100 #TODO implement
  end

  def create_tickets(params)
    seats = params[:seat_ids]
    print seats

    event = params[:event_id]
    print event
    user = current_user
    print user

    seats
  end
end
