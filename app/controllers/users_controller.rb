class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authorize, only: [:show, :edit, :update, :destroy, :index, :charge]

  # GET /users
  def index
    @users = User.all
  end

  # GET /users/1
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        log_in @user
        format.html {redirect_to '/events', notice: 'Rejestracja zakończona pomyślnie'}
      else
        format.html {render :new}
      end
    end
  end

  # PATCH/PUT /users/1
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html {redirect_to @user, notice: 'User was successfully updated.'}
      else
        format.html {render :edit}
      end
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
    respond_to do |format|
      format.html {redirect_to users_url, notice: 'User was successfully destroyed.'}
    end
  end

  def charge
    @charge = AccountCharge.new
  end

  def charged
    @user = current_user
    amount = params[:account_charge][:amount]
    check_code = params[:account_charge][:check_code]
    account_charge = AccountCharge.new({:amount => amount, :check_code => check_code})
    account_charge.validate
    unless account_charge.valid?
      @charge = account_charge
      render 'users/charge', charge: @charge
      return
    end
    new_balance = @user.balance + amount.to_d
    if @user.update_attribute(:balance, new_balance)
      respond_to do |format|
        format.html {redirect_back fallback_location: '/charge', notice: 'Konto zostało zasilone środkami'}
      end
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  def authorize
    if current_user.nil?
      redirect_to "/"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params
    params.require(:user).permit(:email, :password)
  end
end
