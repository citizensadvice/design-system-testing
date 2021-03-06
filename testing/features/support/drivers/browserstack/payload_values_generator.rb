# frozen_string_literal: true

module Drivers
  class Browserstack
    class PayloadValuesGenerator
      class << self
        include Helpers::EnvVariables
        include Helpers::Methods

        def build_name
          if master?
            "Design System - #{pr_with_sha} - URL: #{base_url}"
          elsif branch?
            "Design System - #{pr_without_sha} - URL: #{base_url}"
          else
            "Local Machine run - Month #{Time.now.month} - Ignore results!"
          end
        end

        def session_name
          if branch? || master?
            "SHA: #{sha} - CALLING_PROJECT: design-system"
          else
            "Local run: Ran at #{timestamp}"
          end
        end

        private

        def master?
          docker_tag&.include?("master")
        end

        def branch?
          docker_tag&.include?("PR-")
        end

        # Example: PR-284
        def pr_without_sha
          pr_with_sha.split("_").first
        end

        # Example: ad4b223
        def sha
          pr_with_sha.split("_").last
        end

        # Example: master_ad4b223
        # Example: PR-284_dbbb8b6
        def pr_with_sha
          @pr_with_sha ||= docker_tag.delete_prefix("design-system/")
        end
      end
    end
  end
end
