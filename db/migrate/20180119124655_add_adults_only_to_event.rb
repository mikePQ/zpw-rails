class AddAdultsOnlyToEvent < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :adult_only, :boolean, default: false
  end
end
