# frozen_string_literal: true

module Input
  class Basic < ::Base
    set_url "/iframe.html?id=forms-input--basic&viewMode=story"

    element :input, ".cads-input"
    element :title_label, "label"
    element :hint, ".cads-form-field__hint"
    element :optional_label, ".cads-form-field__optional"
    element :error_message, ".cads-form-field__error-message"

    def validate_initial_state!
      has_input?(wait: 5)
    end
  end
end
