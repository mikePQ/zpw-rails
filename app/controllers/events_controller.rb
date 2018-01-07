class EventsController < ApplicationController
  def index
    @events = Event.all
  end

  def new
    @event = Event.new
  end

  def create
    event_params = params.require(:event).permit(:artist, :description,
                                                 :price_low, :price_high, :event_date)

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
end
