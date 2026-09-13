task :dev do
    sh "bundle exec jekyll clean"
    sh "bundle exec jekyll build"
    sh "bundle exec jekyll serve --host 127.0.0.1 --port 4000"
  end

  desc "Local tweet-render JSON+image proxy (http://127.0.0.1:3457)"
  task :tweet_proxy do
    sh "node tools/tweet-render/proxy/server.mjs"
  end
  