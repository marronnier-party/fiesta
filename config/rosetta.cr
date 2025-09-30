require "rosetta"

@[Rosetta::DefaultLocale(:fr)]
@[Rosetta::AvailableLocales(:fr, :en)]
module Rosetta
end

Rosetta::Backend.load("./config/rosetta")
