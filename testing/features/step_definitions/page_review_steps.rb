# frozen_string_literal: true

Given("a Standard Page Review component is on the page") do
  @component = PageReview::Standard.new.tap(&:load)
end

Then("the date that the page was last reviewed is present") do
  expect(@component.reviewed_on.text).to start_with(@component.localised_reviewed_on_prefix)
end

Then("the date is bold") do
  expect(@component).to have_bold_date
end
