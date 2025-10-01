class UI::StatsWidget < BaseComponent
  record Stat,
    title : String,
    value : String,
    color : String = "text-base-content"

  needs stats : Array(Stat)
  needs width : String = "full"

  def render
    div class: "stats shadow w-#{width}" do
      stats.each do |stat|
        render_stat(stat)
      end
    end
  end

  private def render_stat(stat)
    div class: "stat" do
      div class: "stat-title" do
        text stat.title
      end
      div stat.value, class: "stat-value #{stat.color}"
    end
  end
end
