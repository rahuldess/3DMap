class SvgController < ApplicationController
  def svg_path
    render json: city_object
  end

  def city_object
    array = [];

    City.singleton_methods.each do |method|
      hash = {}
      city_name         =  method.to_s.split('_')[0..-2].join(" ").split.map(&:capitalize).join(' ')
      zip_code          =  method.to_s.split('_').last

      hash["city_name"] = city_name
      hash["zip_code"]  = zip_code
      hash["path"]      = City.send(method)
      hash["color"]     = color_match[city_name]
      hash["geo_base"]  = geo_amt_base[city_name]
      array.push(hash)
    end

    return array
  end

  def geo_amt_base
    {
      "Santa Clara"   => 70,
      "San Jose"      => 80,
      "Mountain View" => 40,
      "Cupertino"     => 20,
      "Campbell"      => 10,
      "Los Altos"     => 65,
      "Palo Alto"     => 45,
      "Saratoga"      => 70,
      "Sunnyvale"     => 100,
      "Alviso"        => 10
    }
  end

  def color_match
    {
      "Santa Clara"   => "#5E0AC2",
      "San Jose"      => "#2E0ACC",
      "Mountain View" => "#666900",
      "Cupertino"     => "gold",
      "Campbell"      => "#4093FF",
      "Los Altos"     => "#68D600",
      "Palo Alto"     => "#B1B500",
      "Saratoga"      => "#4271B5",
      "Sunnyvale"     => "#B568FF",
      "Alviso"        => "#CA49D9"
    }
  end
  # def color_match
  #   {
  #     "Santa Clara"   => "red",
  #     "Santa Jose"    => "yellow",
  #     "Mountain View" => "blue",
  #     "Cupertino"     => "green",
  #     "Campbell"      => "purple",
  #     "Los Altos"     => "brown",
  #     "Palo Alto"     => "black",
  #     "Saratoga"      => "white",
  #     "Sunnyvale"     => "gold"
  #   }
  # end

  #
  # {
  #   paths: [
  #     "#{City.zip95132}",
  #     "#{City.zip95134}",
  #     "#{City.zip95002}",
  #     "#{City.zip94089}",
  #     "#{City.zip95054}",
  #     "#{City.zip94040}",
  #     "#{City.zip95131}",
  #     "#{City.zip94022}",
  #     "#{City.zip95127}",
  #     "#{City.zip94086}",
  #     "#{City.zip94041}",
  #     "#{City.zip95133}",
  #     "#{City.zip94024}",
  #     "#{City.zip95112}",
  #     "#{City.zip95051}",
  #     "#{City.zip95110}",
  #     "#{City.zip94087}",
  #     "#{City.zip95050}",
  #     "#{City.zip95116}",
  #     "#{City.zip95148}",
  #     "#{City.zip95126}",
  #     "#{City.zip95122}",
  #     "#{City.zip95135}",
  #     "#{City.zip95014}",
  #     "#{City.zip95128}",
  #     "#{City.zip95117}",
  #     "#{City.zip95125}",
  #     "#{City.zip95129}",
  #     "#{City.zip95121}",
  #     "#{City.zip95111}",
  #     "#{City.zip95008}",
  #     "#{City.zip95130}",
  #     "#{City.zip95138}",
  #     "#{City.zip95136}",
  #     "#{City.zip95070}",
  #     "#{City.zip95124}",
  #     "#{City.zip95118}",
  #     "#{City.zip95123}",
  #     "#{City.zip95119}",
  #     "#{City.zip95120}",
  #     "#{City.zip95139}",
  #     "#{City.zip94303}",
  #     "#{City.zip94043}",
  #     "#{City.zip94306}"
  #           ],
  #     amounts: [ 50, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20, 30, 100, 30, 20,
  #                70, 99, 10, 100, 50, 20, 30, 100, 30, 20, 70, 99, 10, 100, 50,
  #                20, 30, 100, 30, 20, 70, 99, 10, 100, 50, 20, 30, 30, 30, 30, 30, 30 ],
  #     info: [ { name: '95132', color: '#ffcccc' },
  #             { name: '95134', color: '#ffb2b2' },
  #             { name: '95002', color: '#ff9999' },
  #             { name: '94089', color: '#ff7f7f' },
  #             { name: '95054', color: '#ff6666' },
  #             { name: '94040', color: '#ff4c4c' },
  #             { name: '95131', color: '#ffe5e5' },
  #             { name: '94022', color: 'orange'  },
  #             { name: '95127', color: '#ff9999' },
  #             { name: '94086', color: '#ff7f7f' },
  #             { name: '94041', color: '#ff6666' },
  #             { name: '95133', color: '#ffb2b2' },
  #             { name: '94024', color: '#ff9999' },
  #             { name: '95112', color: '#ff7f7f' },
  #             { name: '95051', color: '#ff6666' },
  #             { name: '95110', color: '#ff4c4c' },
  #             { name: '94087', color: '#ffe5e5' },
  #             { name: '95050', color: 'orange'  },
  #             { name: '95116', color: '#ff9999' },
  #             { name: '95148', color: '#ff7f7f' },
  #             { name: '95126', color: '#ff6666' },
  #             { name: '95122', color: '#ffb2b2' },
  #             { name: '95135', color: '#ff9999' },
  #             { name: '95014', color: '#ff7f7f' },
  #             { name: '95128', color: '#ff6666' },
  #             { name: '95117', color: '#ff4c4c' },
  #             { name: '95125', color: '#ffe5e5' },
  #             { name: '95129', color: 'orange'  },
  #             { name: '95121', color: '#ff9999' },
  #             { name: '95111', color: '#ff7f7f' },
  #             { name: '95008', color: '#ff6666' },
  #             { name: '95130', color: '#ffb2b2' },
  #             { name: '95138', color: '#ff9999' },
  #             { name: '95136', color: '#ff7f7f' },
  #             { name: '95070', color: '#ff6666' },
  #             { name: '95124', color: '#ff4c4c' },
  #             { name: '95118', color: '#ffe5e5' },
  #             { name: '95123', color: 'orange'  },
  #             { name: '95119', color: '#ff9999' },
  #             { name: '95120', color: '#ff7f7f' },
  #             { name: '95139', color: '#ff6666' },
  #             { name: '94303', color: '#ff6666' },
  #             { name: '94043', color: '#ff6666' },
  #             { name: '94306', color: '#ff9999' }],
  #     center: { x: 600, y: 1000 }
  #   }


  # colors: [ '#ffcccc', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2',
  #           '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2', '#ff9999', '#ff7f7f',
  #           '#ff6666', '#ff4c4c', '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ffb2b2', '#ff9999', '#ff7f7f', '#ff6666', '#ff4c4c',
  #           '#ffe5e5', 'orange', '#ff9999', '#ff7f7f', '#ff6666', '#ff6666', '#ff6666', '#ff9999', '#ff6666', '#ff7f7f'],


end
