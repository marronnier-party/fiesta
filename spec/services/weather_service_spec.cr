require "../spec_helper"

describe WeatherService do
  describe ".get_forecast" do
    it "returns nil for missing coordinates" do
      date = Time.utc + 7.days
      forecast = WeatherService.get_forecast(nil, nil, date)
      forecast.should be_nil
    end

    it "returns nil for past events" do
      date = Time.utc - 1.day
      forecast = WeatherService.get_forecast(45.5017, -73.5673, date)
      forecast.should be_nil
    end

    it "returns nil for events more than 14 days away" do
      date = Time.utc + 15.days
      forecast = WeatherService.get_forecast(45.5017, -73.5673, date)
      forecast.should be_nil
    end

    it "returns forecast for upcoming event within 14 days" do
      date = Time.utc + 7.days
      forecast = WeatherService.get_forecast(45.5017, -73.5673, date)

      forecast.should_not be_nil
      forecast = forecast.not_nil!
      forecast.temperature.should be > 0
      forecast.condition.should_not be_empty
      forecast.humidity.should be > 0
      forecast.wind_speed.should be >= 0
    end

    it "includes weather conditions" do
      date = Time.utc + 3.days
      forecast = WeatherService.get_forecast(45.5017, -73.5673, date)

      forecast.should_not be_nil
      forecast = forecast.not_nil!
      ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"].should contain(forecast.condition)
    end
  end

  describe ".get_weather_alert" do
    it "returns alert for rainy conditions" do
      forecast = WeatherService::WeatherForecast.new(
        temperature: 20.0,
        condition: "Rainy",
        description: "Test",
        humidity: 80,
        wind_speed: 15.0,
        icon: "rain"
      )

      alert = WeatherService.get_weather_alert(forecast)
      alert.should_not be_nil
      alert.not_nil!.should contain("Pluie")
    end

    it "returns alert for high temperature" do
      forecast = WeatherService::WeatherForecast.new(
        temperature: 35.0,
        condition: "Sunny",
        description: "Test",
        humidity: 60,
        wind_speed: 10.0,
        icon: "sun"
      )

      alert = WeatherService.get_weather_alert(forecast)
      alert.should_not be_nil
      alert.not_nil!.should contain("température")
    end

    it "returns alert for cold weather" do
      forecast = WeatherService::WeatherForecast.new(
        temperature: 5.0,
        condition: "Cloudy",
        description: "Test",
        humidity: 70,
        wind_speed: 20.0,
        icon: "cloud"
      )

      alert = WeatherService.get_weather_alert(forecast)
      alert.should_not be_nil
      alert.not_nil!.should contain("froid")
    end

    it "returns nil for good weather" do
      forecast = WeatherService::WeatherForecast.new(
        temperature: 22.0,
        condition: "Sunny",
        description: "Test",
        humidity: 60,
        wind_speed: 10.0,
        icon: "sun"
      )

      alert = WeatherService.get_weather_alert(forecast)
      alert.should be_nil
    end

    it "returns nil for nil forecast" do
      alert = WeatherService.get_weather_alert(nil)
      alert.should be_nil
    end
  end
end
