class AddReturnedToTicket < ActiveRecord::Migration[5.1]
  def change
    add_column :tickets, :returned, :boolean, default: false
  end
end
