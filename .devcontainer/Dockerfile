FROM mcr.microsoft.com/devcontainers/ruby:2.7

# Install Node.js (required for CoffeeScript/ExecJS in your Gemfile)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install the exact Bundler version requested
RUN gem install bundler -v 2.3.15