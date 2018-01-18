class TicketsController < ApplicationController
  include TicketsHelper
  before_action :set_ticket, only: [:show, :edit, :update, :destroy]
  before_action :authorize

  # GET /tickets
  def index
    @tickets = Ticket.all
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
    @ticket.user_id = current_user.id

    respond_to do |format|
      if @ticket.save
        format.html {redirect_to @ticket, notice: 'Ticket was successfully created.'}
      else
        format.html {render :new}
      end
    end
  end

  # PATCH/PUT /tickets/1
  def update
    respond_to do |format|
      if @ticket.update(ticket_params)
        format.html {redirect_to @ticket, notice: 'Ticket was successfully updated.'}
      else
        format.html {render :edit}
      end
    end
  end

  # DELETE /tickets/1
  def destroy
    @ticket.destroy
    respond_to do |format|
      format.html {redirect_to tickets_url, notice: 'Ticket was successfully destroyed.'}
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
    user_id = current_user.id
    price = ticket_price(event_id)

    seat_ids.each do |seat|
      @ticket = Ticket.new({:seat_id_seq => seat, :event_id => event_id, :name => name, :email_address => email, :phone => phone, :user_id => user_id, :price => price, :address => address})
      @ticket.save
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
