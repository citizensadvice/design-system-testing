# frozen_string_literal: true

Given("the navigation is on the page") do
  @component = Navigation::Default.new.tap(&:load)
end

Given("the navigation does not fit on the screen") do 
  page.driver.browser.manage.window.resize_to(320, 568)
end

Given("the dropdown menu is already open") do
  page.driver.browser.manage.window.resize_to(320, 568)
  click_button("More")
end
  
Then("the dropdown toggle is not present") do 
  expect(@component).to have_no_button("More")
end

Then("the dropdown toggle is present") do 
  expect(@component).to have_button("More")
end

Then("the dropdown menu is hidden") do
  expect(@component).to have_no_link("More from us")
end

Then("the dropdown menu is present") do 
  expect(@component).to have_link("More from us")
end

Then("the Close button is present") do
  expect(@component).to have_button("Close")
end

Then("the More button is present") do
  expect(@component).to have_button("More")
end

When("I click the More button") do 
  click_button("More")
end

When("I click the Close button") do
  click_button("Close")
end

When("I tab onto the More button") do
  5.times do
    @component.send_keys(:tab)
  end
end

When("I tab out of the dropdown menu") do
  10.times do 
    @component.send_keys(:tab)
  end
end

When("I press 'Escape'") do
  @component.send_keys(:escape)
end

When("I click outside of the menu") do 
  nav = find('.js-cads-greedy-nav')
  nav.click(x: 0, y: 400)
end