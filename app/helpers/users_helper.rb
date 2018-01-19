module UsersHelper
  def get_user(user_id)
    User.find_by(:id => user_id)
  end
end