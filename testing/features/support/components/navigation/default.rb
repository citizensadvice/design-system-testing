# frozen_string_literal: true

module Navigation
  class Defualt < ::Base
    set_url "/iframe.html?id=components-navigation--default-story&viewMode=story"

    element :navigation, '.js-cads-greedy-nav'
  end
end
