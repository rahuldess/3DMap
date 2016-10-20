class HomeController < ApplicationController
  def show
    @geo  = params["area"]
    @type = params["type"]
  end

  def popover
  end

end
