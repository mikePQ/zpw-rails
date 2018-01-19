Rails.application.routes.draw do
  root :to => 'pages#home'

  resources :events
  resources :users, :only => [:new, :create]
  resources :tickets

  get '/buy', to: 'tickets#buy'
  post '/buy', to: 'tickets#create_all'
  post '/return', to: 'tickets#return'

  get '/signup', to: 'users#new'
  get '/charge', to: 'users#charge'
  post '/charge', to: 'users#charged'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
end
