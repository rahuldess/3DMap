# Migrate from redis_stash to running Redis instance.
task :migrate_redis_data do
  Dir.glob("#{Rails.root}/redis_stash/*.json") do |file|
    file_ref    = File.open(file).read
    parsed_data = JSON.parse(file_ref, symbolize_names: true)
    key_name    = parsed_data[:city].parameterize('_')
    $redis.set(key_name, parsed_data) if key_name.present?
  end
end
