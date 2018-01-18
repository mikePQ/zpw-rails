Rails.application.routes.draw do
  root :to => 'pages#home'

  resources :events, :only => [:index, :new, :create, :show]
  resources :users, :only => [:new, :create]
  resources :tickets

  get '/buy', to: 'tickets#buy'

  get '/signup', to: 'users#new'
  get '/charge', to: 'users#charge'
  post '/charge', to: 'users#charged'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
end
