# frozen_string_literal: true

# Drop this file into your Jekyll site's `_plugins/` folder.
# Put `players-web.enc.json` in `_data/` (or set PLAYERS_ENC_PATH).
# Set env var PLAYERS_DATA_KEY to the same passphrase used to encrypt.
#
# Usage in Liquid:
#   {% for p in site.data.players %}
#     {{ p.firstName }} {{ p.lastName }} — {{ p.overallRating }}
#   {% endfor %}

require "json"
require "openssl"
require "base64"

module PlayersEnc
  module Decrypt
    module_function

    def load_players(site)
      password = ENV["PLAYERS_DATA_KEY"]
      raise "PLAYERS_DATA_KEY is not set" if password.nil? || password.empty?

      enc_path = ENV.fetch("PLAYERS_ENC_PATH") do
        File.join(site.source, "_data", "players-web.enc.json")
      end
      raise "Encrypted players file not found: #{enc_path}" unless File.file?(enc_path)

      payload = JSON.parse(File.read(enc_path))
      raise "Unsupported payload version" unless payload["v"] == 1
      raise "Unsupported alg" unless payload["alg"] == "aes-256-gcm"

      salt = Base64.decode64(payload["salt"])
      iv = Base64.decode64(payload["iv"])
      tag = Base64.decode64(payload["tag"])
      ciphertext = Base64.decode64(payload["ciphertext"])
      iterations = payload.fetch("iterations", 210_000)

      key = OpenSSL::PKCS5.pbkdf2_hmac(password, salt, iterations, 32, "sha256")
      decipher = OpenSSL::Cipher.new("aes-256-gcm")
      decipher.decrypt
      decipher.key = key
      decipher.iv = iv
      decipher.auth_tag = tag
      plaintext = decipher.update(ciphertext) + decipher.final

      JSON.parse(plaintext)
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  site.data["players"] = PlayersEnc::Decrypt.load_players(site)
  Jekyll.logger.info "players:", "decrypted #{site.data['players'].size} players into site.data.players"
end
