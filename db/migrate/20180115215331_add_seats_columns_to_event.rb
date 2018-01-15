class AddSeatsColumnsToEvent < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :seats_columns, :integer
  end
end
