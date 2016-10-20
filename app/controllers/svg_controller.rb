class SvgController < ApplicationController
  def svg_path
    render json: city_object
  end

  def city_object
    {
      paths: [
        "#{City.zip95132}",
        "#{City.zip95134}",
        "#{City.zip95002}",
        "#{City.zip94089}",
        "#{City.zip95054}",
        "#{City.zip94040}",
        "#{City.zip95131}",
        "#{City.zip94022}",
        "#{City.zip95127}",
        "#{City.zip94086}",
        "#{City.zip94041}",
        "#{City.zip95133}",
        "#{City.zip94024}",
        "#{City.zip95112}",
        "#{City.zip95051}",
        "#{City.zip95110}",
        "#{City.zip94087}",
        "#{City.zip95050}",
        "#{City.zip95116}",
        "#{City.zip95148}",
        "#{City.zip95126}",
        "#{City.zip95122}",
        "#{City.zip95135}",
        "#{City.zip95014}",
        "#{City.zip95128}",
        "#{City.zip95117}",
        "#{City.zip95125}",
        "#{City.zip95129}",
        "#{City.zip95121}",
        "#{City.zip95111}",
        "#{City.zip95008}",
        "#{City.zip95130}",
        "#{City.zip95138}",
        "#{City.zip95136}",
        "#{City.zip95070}",
        "#{City.zip95124}",
        "#{City.zip95118}",
        "#{City.zip95123}",
        "#{City.zip95119}",
        "#{City.zip95120}",
        "#{City.zip95139}",
        "#{City.zip94303}",
        "#{City.zip94043}",
        "#{City.zip94306}"
              ],
        amounts: [ 50, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20 ],
        colors: [ '#ffcccc', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666'],
        info: [{ name: 'Sunnyvale' },
                { name: 'Santa Clara' },
                { name: 'Mountain View' },
                { name: 'San Jose' },
                { name: 'Cupertino'},
                { name: 'Campbell'},
                { name: 'Saratoga'},
                { name: 'Milpitas'}],
        center: { x: 600, y: 1000 }
      }
    end
  end
