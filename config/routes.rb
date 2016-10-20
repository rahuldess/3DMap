Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#show'

  get '/load_city_data', to: 'svg#svg_path'

  # Examples:
  # http://localhost:3000/area_statistics?area=santa_clara&type=hot_area
  get '/area_statistics', to: 'statistics#area'

end
