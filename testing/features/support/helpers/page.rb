# frozen_string_literal: true

module Helpers
  module Page
    include Helpers::Methods
    include Helpers::EnvVariables
    include Helpers::Javascript

    def resize_window(desired_width = width, desired_height = height)
      AutomationLogger.warn("Resizing Windows on Browserstack IE can be flaky!") if browserstack? && internet_explorer?
      Capybara.current_window.resize_to(desired_width, desired_height)
    end

    def save_full_page_screenshot(scenario)
      path = image_file_path(scenario)
      resize_page_to_fullsize
      AutomationLogger.info("Taking a screenshot to #{path}")
      save_image(path)
      attach(path, "image/png")
    end

    def switch_to_newly_opened_window!(new_page: false)
      wait_for_second_window
      page.switch_to_window(second_window)
      wait_for_new_url if firefox? && new_page
    end

    def send_tabs(count)
      count.times do
        if safari?
          send_keys(%i[alt tab])
          # In Safari the modifier key (OPTION, but called :alt), is not
          # released after being used in the alt+tab call. This means that
          # subsequent calls do things like alt+click which downloads a link.
          #
          # See: https://bugs.webkit.org/show_bug.cgi?id=219948
          # LH - Dec 2020
          send_keys(:alt)
        else
          send_keys(:tab)
        end
        sleep 0.1
      end
    end

    def tab_quantity_for_skip_link(desired_area)
      case desired_area
      when :navigation; then 1
      when :content;    then 2
      when :footer;     then 3
      else raise "Invalid Input argument for tabbing!"
      end
    end

    private

    def resize_page_to_fullsize
      AutomationLogger.info("Resizing page to full page size.")
      AutomationLogger.debug("Note that for HEADED chrome this won't work!") if chrome? && !headless?
      resize_window(width(fallback: 1024), height_of_page + 150)
    end

    def save_image(path)
      current_session.save_screenshot(path)
    end

    def image_file_path(test_case)
      "#{ENV['BASE_ARTIFACTS_PATH']}/screenshots/#{name_of_file(test_case)}.png"
    end

    def name_of_file(test_case)
      "#{timestamp}_#{test_case.feature_file_name}_#{test_case.name.gsub('/', 'or').gsub(' ', '_')}"
    end

    def width(fallback: 1600)
      ENV.fetch("BROWSER_WIDTH", fallback)
    end

    def height(fallback: 800)
      ENV.fetch("BROWSER_HEIGHT", fallback)
    end

    def wait_for_second_window
      Selenium::WebDriver::Wait.new.until { page.windows.length == 2 }
    end

    def second_window
      page.windows.detect { |window| !window.current? }
    end

    def wait_for_new_url
      Selenium::WebDriver::Wait.new.until { page.current_url != "about:blank" }
    end
  end
end
