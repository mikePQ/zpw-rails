class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  def index
    start_date = params[:start_date]
    end_date = params[:end_date]

    search = params[:search]
    if search.to_s.empty?
      @events = Event.filter(start_date, end_date).order("event_date desc").paginate(:per_page => 10, :page => params[:page])
    else
      @events = Event.search(search).order("event_date desc").paginate(:per_page => 10, :page => params[:page])
    end
  end

  def new
    @event = Event.new
  end

  def destroy
    @event.destroy
    respond_to do |format|
      format.html {redirect_to events_url, notice: 'Ogłoszenie zostało usunięte.'}
    end
  end

  def edit
  end

  def update
    event_params = params.require(:event).permit(:artist, :description,
                                                 :price_low, :price_high, :event_date, :seats_rows, :seats_columns, :adult_only)
    respond_to do |format|
      if @event.update(event_params)
        format.html {redirect_to @event, notice: 'Ogłoszenie zostało zaktualizowane'}
      else
        format.html {render :edit}
      end
    end
  end

  def create
    event_params = params.require(:event).permit(:artist, :description,
                                                 :price_low, :price_high, :event_date, :seats_rows, :seats_columns, :adult_only)

    @event = Event.new(event_params)
    if @event.save
      flash[:message] = 'Event został poprawnie stworzony.'
      redirect_to @event
    else
      render new_event_path
    end
  end

  def show
    @event = Event.find(params[:id])
  end

  private
  def set_event
    @event = Event.find(params[:id])
  end
end
