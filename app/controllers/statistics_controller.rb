class StatisticsController < ApplicationController

  def area
    statistics_obj = Statistics.new(permitted_params).get
    render :json => statistics_obj
  end

  private

  def permitted_params
    params.permit(:area, :type).symbolize_keys
  end

end
