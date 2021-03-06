module EventsHelper
  def format_date(date)
    date.strftime("%H:%M %d/%m/%Y")
  end

  def current_events(events)
    events.select {|event| !is_archived(event)}
  end

  def archived_events(events)
    events.select {|event| is_archived(event)}
  end

  def is_archived(event)
    event.event_date.past?
  end

  def get_event(event_id)
    Event.find_by(:id => event_id)
  end
end

