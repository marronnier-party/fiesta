abstract class BaseComponent < Lucky::BaseComponent
  include Rosetta::Translatable
  include DateFormatHelper
  include HtmxHelper

  # Helper macro to render icons easily
  macro icon(icon_name, icon_classes = "w-4 h-4")
    mount UI::Icon, name: {{icon_name}}, classes: {{icon_classes}}
  end
end
