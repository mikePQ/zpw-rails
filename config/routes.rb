Rails.application.routes.draw do
  resources :events, :only => [:index, :new, :create, :show]
  resources :tickets

  root :to => "tickets#index"
end
