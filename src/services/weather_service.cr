class WeatherService
  struct WeatherForecast
    property temperature : Float64
    property condition : String
    property description : String
    property humidity : Int32
    property wind_speed : Float64
    property icon : String

    def initialize(@temperature, @condition, @description, @humidity, @wind_speed, @icon)
    end
  end

  # For now, this returns mock data
  # In production, this would call a weather API like OpenWeatherMap
  def self.get_forecast(latitude : Float64?, longitude : Float64?, date : Time) : WeatherForecast?
    return nil if latitude.nil? || longitude.nil?

    # Only return forecast if event is within next 14 days
    days_until_event = (date - Time.utc).days.to_i
    return nil if days_until_event < 0 || days_until_event > 14

    # Mock weather data
    # In production, call: https://api.openweathermap.org/data/2.5/forecast
    # Using lat/lon and date

    WeatherForecast.new(
      temperature: 22.0 + (days_until_event % 5),
      condition: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"].sample || "Sunny",
      description: "Perfect weather for your event!",
      humidity: 60 + (days_until_event % 20),
      wind_speed: 10.0 + (days_until_event % 5),
      icon: "sun"
    )
  end

  def self.get_weather_alert(forecast : WeatherForecast?) : String?
    return nil if forecast.nil?

    if forecast.condition == "Rainy"
      "⚠️ Rain expected - consider indoor backup plan"
    elsif forecast.temperature > 30
      "☀️ High temperature expected - ensure shade and water"
    elsif forecast.temperature < 10
      "❄️ Cold weather expected - dress warmly"
    end
  end
end
