# frozen_string_literal: true

Jekyll::Hooks.register :site, :after_init do |site|
  token = ENV['MAPBOX_ACCESS_TOKEN']
  token = token.strip unless token.nil? || token.empty?

  if token.nil? || token.empty?
    local_config_path = File.join(site.source, '_config.local.yml')
    if File.exist?(local_config_path)
      local_config = YAML.safe_load(File.read(local_config_path), permitted_classes: [Date, Time], aliases: true) || {}
      token = local_config['mapbox_access_token']
      token = token.strip if token.is_a?(String) && !token.empty?
    end
  end

  site.config['mapbox_access_token'] = token if token && !token.empty?
end
