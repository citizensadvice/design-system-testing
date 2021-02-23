# frozen_string_literal: true

class Driver
  include Helpers::EnvVariables

  def initialize
    setup_capybara
    setup_site_prism
    setup_selenium_webdriver
  end

  def register
    if grid?
      ::CaTesting::Drivers::Remote.new(browser).register
    elsif browserstack?
      Drivers::Browserstack.new.register
    else
      ::CaTesting::Drivers::Local.new(browser).register
    end
  end

  private

  def setup_capybara
    Capybara.configure do |config|
      config.run_server = false
      config.default_driver = :selenium
      config.default_max_wait_time = 1
      config.app_host = base_url
      config.default_normalize_ws = true if safari?
    end
  end

  def setup_site_prism
    SitePrism.configure do |config|
      config.log_path = "#{ENV['BASE_ARTIFACTS_PATH']}/logs/site_prism.log"
      config.log_level = :INFO

      # This will be required until v4 of SitePrism is released
      require "site_prism/all_there"
      config.use_all_there_gem = true
    end
  end

  def setup_selenium_webdriver
    Selenium::WebDriver.logger.level = :INFO
    Selenium::WebDriver.logger.output = "#{ENV['BASE_ARTIFACTS_PATH']}/logs/webdriver.log"
  end
end
