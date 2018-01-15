class AddSeatsRowsToEvent < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :seats_rows, :integer
  end
end
