module TicketsHelper
  def user_tickets(tickets)
    if current_user.admin?
      return tickets
    end
    tickets.select {|ticket| ticket.user_id == current_user.id}
  end
end
