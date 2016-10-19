class SvgController < ApplicationController
  def svg_path
    render json: city_object
  end

  def city_object
    {
      paths: [  "#{City.sunnyvale}",
                "#{City.santa_clara}",
                "#{City.mountain_view}",
                "#{City.san_jose}",
                "#{City.cupertino}",
                "#{City.campbell}",
                "#{City.saratoga}",
                "#{City.milpitas}"],
        amounts: [ 50, 30, 100, 30, 20, 70, 99, 10 ],
        colors: [ '#ffcccc', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange' ],
        info: [{ name: 'Sunnyvale' },
                { name: 'Santa Clara' },
                { name: 'Mountain View' },
                { name: 'San Jose' },
                { name: 'Cupertino'},
                { name: 'Campbell'},
                { name: 'Saratoga'},
                { name: 'Milpitas'}],
        center: { x: 600, y: 150 }
      }
    end
  end
