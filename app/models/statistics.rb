class Statistics

  def initialize(params)
    @requested_geo = params[:area]
    @module        = params[:type]
  end

  def get
    self.send(@module)
  end


  private

  def hot_area
    if @requested_geo.eql?("south_bay")
      fetch_south_bay
    else
      data = fetch_geo_data(@requested_geo)
      updated_data_set(data)
    end
  end

  def fetch_geo_data(area)
    area_path = "#{Rails.root}/redis_stash/#{area}.json"
    file_ref    = File.open(area_path).read
    JSON.parse(file_ref, symbolize_names: true)
  end

  def fetch_south_bay
    area_collection = []
    Dir.glob("#{Rails.root}/redis_stash/*.json") do |file|
      file_ref    = File.open(file).read
      parsed_data = JSON.parse(file_ref, symbolize_names: true)
      area_collection << south_bay_statistics(updated_data_set(parsed_data))
    end
    area_collection
  end

  def south_bay_statistics(data)
    total_views = 0
    total_leads = 0
    total_shared = 0
    total_saved = 0
    data[:areas].each do |i|
      total_views += i[:most_viewed]
      total_leads += i[:leads_submitted]
      total_shared += i[:shared]
      total_saved += i[:saved]
    end
    data[:total_views] = total_views
    data[:total_leads] = total_leads
    data[:total_shared] = total_shared
    data[:total_saved] = total_saved
    data
  end

  def updated_data_set(data)
    data[:areas].each do |zip_code|
      most_viewed     = 0
      leads_submitted = 0
      shared          = 0
      saved           = 0
      zip_code[:properties].each do |item|
        item[:data_points].each do |set|
          most_viewed     += set[:views]
          leads_submitted += set[:leads]
          shared          += set[:shared]
          saved           += set[:saved]
        end
        zip_code[:most_viewed] = most_viewed
        zip_code[:leads_submitted] = leads_submitted
        zip_code[:shared] = shared
        zip_code[:saved] = saved
      end
    end
    data
  end

end
