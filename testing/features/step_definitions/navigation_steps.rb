# frozen_string_literal: true

Given("the navigation is on the page") do
  @component = Navigation::Default.new.tap(&:load)
end
  
Then("the dropdown toggle is not present") do 
  expect(@component).to have_no_button("More")
end

Then("the dropdown toggle is present") do 
  expect(@component).to have_button("Close")
end