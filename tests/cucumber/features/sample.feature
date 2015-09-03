Feature: Teaching new process

  As a Simple User
  I want to teach a new process out of existing tasks and processes
  So that I can perform that process at a later time

  Teaching a new process is all about letting the user itself and other users use that process
  with its new logic. A new process is made out of existing tasks and processes and needs to have
  a very specific responsibility for achieving a goal.

  # The background will be run for every scenario
  Background:
    Given I navigate to "/"

  # This scenario will run as part of the Meteor dev cycle because it has the @dev tag
  @dev
  Scenario: This scenario will run on both dev and CI
    When I navigate to "/"
    Then I should see the title "intentional failure"

  # This scenario will not run as part of the Meteor dev cycle because it does not have the @dev tag
  # But it will run on CI if you use `meteor --test` for instance
  Scenario: This scenario will not run on dev but does run on CI
    When I navigate to "/"
    Then I should see the title "another intentional failure"

  # The @ignore tag is a convenience tag included by meteor-cucumber. See the docs for more on tags
  @ignore
  Scenario: This scenario will not run anywhere
    When I navigate to "/"
    Then I should see the title "it really doesn't matter"
