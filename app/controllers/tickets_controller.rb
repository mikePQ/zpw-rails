class TicketsController < ApplicationController
  include TicketsHelper, EventsHelper, UsersHelper
  before_action :set_ticket, only: [:show, :edit, :update, :destroy]
  before_action :authorize

  # GET /tickets
  def index
    start_date = params[:start_date]
    end_date = params[:end_date]

    artist = params[:artist]
    if artist.to_s.empty?
      @tickets = Ticket.filter(start_date, end_date).order("event_date desc").paginate(:per_page => 10, :page => params[:page])
    else
      @tickets = Ticket.search(artist).filter(start_date, end_date).order("event_date desc").paginate(:per_page => 10, :page => params[:page])
    end
  end

  # GET /tickets/1
  def show
  end

  # GET /tickets/new
  def new
    @ticket = Ticket.new({:seat_id_seq => params[:seat_id_seq], :event_id => params[:event_id]})
  end

  # GET /tickets/1/edit
  def edit
  end

  # POST /tickets
  def create
    @ticket = Ticket.new(ticket_params)
    user = current_user
    @ticket.user_id = user.id

    if user.balance < @ticket.price
      raise "Brak wystarczających środków na koncie"
    end

    respond_to do |format|
      if @ticket.save
        new_balance = user.balance - @ticket.price
        user.update_attribute(:balance, new_balance)
        format.html {redirect_to @ticket, notice: 'Bilet został utworzony'}
      else
        format.html {render :new}
      end
    end
  end

  # PATCH/PUT /tickets/1
  def update
    respond_to do |format|
      if @ticket.update(ticket_params)
        format.html {redirect_to @ticket, notice: 'Bilet został zaktualizowany'}
      else
        format.html {render :edit}
      end
    end
  end

  # DELETE /tickets/1
  def destroy
    amount_to_return = get_amount_to_return(@ticket)
    user = get_user(@ticket.user_id)

    @ticket.destroy
    new_balance = user.balance + amount_to_return
    user.update_attribute(:balance, new_balance)

    respond_to do |format|
      format.html {redirect_to tickets_url, notice: 'Bilet został usunięty'}
      format.json {head :no_content}
    end
  end

  def buy
  end

  def create_all
    event_id = params[:event_id]
    name = params[:name]
    email = params[:email]
    phone = params[:phone]
    address = params[:address]

    seat_ids = params[:seat_ids]
    user = current_user
    user_id = user.id
    price = ticket_price(event_id)

    event = get_event(event_id)
    max_tickets = 5 - user_tickets(event.tickets).length

    counter = 0
    seat_ids.each do |seat|
      if counter >= max_tickets
        raise "Limit biletów na wydarzenie został wykorzystany";
      end

      if price > user.balance
        raise "Brak wystarczających środków na koncie"
      end

      @ticket = Ticket.new({:seat_id_seq => seat, :event_id => event_id, :name => name, :email_address => email, :phone => phone, :user_id => user_id, :price => price, :address => address})

      if @ticket.save
        counter += 1
        new_balance = user.balance - @ticket.price
        user.update_attribute(:balance, new_balance)
      end
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_ticket
    @ticket = Ticket.find(params[:id])
  end

  def authorize
    if current_user.nil?
      redirect_to "/"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def ticket_params
    params.require(:ticket).permit(:name, :seat_id_seq, :address, :price, :email_address, :phone, :event_id)
  end
end
