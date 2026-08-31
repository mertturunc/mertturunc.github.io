# frozen_string_literal: true

# GitHub Pages already maps missing URLs to /404.html. Local `jekyll serve`
# uses WEBrick, which only does that if _site/404.html exists at boot.
# Patch the error page at request time so unknown paths always get the site 404.

require "webrick"

module JekyllServe404
  def create_error_page
    root = @config && @config[:DocumentRoot]
    file = root && File.join(root.to_s, "404.html")
    if file && File.file?(file)
      @header["Content-Type"] = "text/html; charset=UTF-8"
      @body = File.binread(file)
      return
    end

    super if defined?(super)
  end
end

WEBrick::HTTPResponse.prepend(JekyllServe404)
