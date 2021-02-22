Feature: Navigation component

  The greedy nav displays as many navigation links as fit on the viewport. 
  Any that don't fit are added into a expandable dropdown.

  @not_mobile
  Scenario: all links fit into the page
    Given: the navigation is on the page
    Then: the dropdown toggle is not present