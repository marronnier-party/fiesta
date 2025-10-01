module HtmxHelper
  # Add htmx attributes to HTML elements
  def hx_get(url : String)
    {"hx-get" => url}
  end

  def hx_post(url : String)
    {"hx-post" => url}
  end

  def hx_put(url : String)
    {"hx-put" => url}
  end

  def hx_delete(url : String)
    {"hx-delete" => url}
  end

  def hx_trigger(event : String)
    {"hx-trigger" => event}
  end

  def hx_target(selector : String)
    {"hx-target" => selector}
  end

  def hx_swap(strategy : String)
    {"hx-swap" => strategy}
  end

  def hx_indicator(selector : String)
    {"hx-indicator" => selector}
  end

  def hx_vals(hash : Hash)
    {"hx-vals" => hash.to_json}
  end

  def hx_confirm(message : String)
    {"hx-confirm" => message}
  end

  # Combine multiple htmx attributes
  def hx_attrs(**attrs)
    result = {} of String => String
    attrs.each do |key, value|
      hx_key = "hx-#{key.to_s.gsub('_', '-')}"
      result[hx_key] = value.to_s
    end
    result
  end

  # Universal attributes helper - combines htmx, Alpine, and regular HTML attributes
  # Usage: attrs(class: "btn", hx_get: "/path", hx_target: "#result", x_data: "{}", **alpine_attrs)
  # For Alpine event handlers with interpolation, pass them separately with .merge()
  def attrs(**attributes)
    result = {} of String => String
    attributes.each do |key, value|
      key_str = key.to_s
      if key_str.starts_with?("hx_")
        # Convert hx_get to hx-get
        result["hx-#{key_str[3..-1].gsub('_', '-')}"] = value.to_s
      elsif key_str.starts_with?("x_")
        # Convert x_data to x-data
        result["x-#{key_str[2..-1].gsub('_', '-')}"] = value.to_s
      elsif key_str.starts_with?("@") || key_str.starts_with?(":")
        # Alpine event/bind attributes - use as-is
        result[key_str] = value.to_s
      else
        # Regular HTML attributes - convert underscores to dashes
        result[key_str.gsub('_', '-')] = value.to_s
      end
    end
    result
  end

  # Helper for building Alpine event attributes that need string interpolation
  # Usage: alpine_events({"@open-modal-#{id}.window" => "open()"})
  def alpine_events(**events)
    {} of String => String
  end

  # Check if request is from htmx
  def htmx_request?
    context.request.headers["HX-Request"]? == "true"
  end

  # Get htmx trigger element
  def htmx_trigger_name
    context.request.headers["HX-Trigger"]?
  end

  # Get current URL from htmx
  def htmx_current_url
    context.request.headers["HX-Current-URL"]?
  end

  # Respond with htmx-specific headers
  def htmx_redirect(url : String)
    context.response.headers["HX-Redirect"] = url
  end

  def htmx_refresh
    context.response.headers["HX-Refresh"] = "true"
  end

  def htmx_trigger_event(event_name : String, detail : Hash? = nil)
    if detail
      context.response.headers["HX-Trigger"] = {event_name => detail}.to_json
    else
      context.response.headers["HX-Trigger"] = event_name
    end
  end

  def htmx_success_message(message : String)
    context.response.headers["X-Success-Message"] = message
  end
end
