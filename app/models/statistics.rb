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
    data = fetch_geo_data(@requested_geo)
    updated_data_set(data)
  end

  def fetch_geo_data(area)
    area_path = "#{Rails.root}/redis_stash/#{area}.json"
    file_ref    = File.open(area_path).read
    JSON.parse(file_ref, symbolize_names: true)
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
