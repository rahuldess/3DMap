class SvgController < ApplicationController
  def svg_path
    city_object = {
      paths: ["#{City.sunnyvale}",
              "#{City.santa_clara}",
              "#{City.mountain_view}",
              "#{City.san_jose}",
              "#{City.cupertino}",
              "#{City.campbell}",
              "#{City.saratoga}",
              "#{City.milpitas}"],
      amounts: [ 50, 30, 100, 30, 20, 70, 99, 10 ],
      colors: [ '#0000A0', '#0000FF', 'green', 'maroon', 'brown', 'blue', 'white', 'orange' ],
      center: { x:350, y:0 }
    }

    render json: city_object
  end
end
