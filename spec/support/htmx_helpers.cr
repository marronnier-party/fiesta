module HtmxHelpers
  # Helper to make HTMX requests in specs
  def htmx_request(user : User, action, **params)
    ApiClient.auth(user)
      .headers("HX-Request": "true")
      .exec(action, **params, backdoor_user_id: user.id)
  end

  # Helper to make authenticated requests
  def auth_request(user : User, action, **params)
    ApiClient.auth(user)
      .exec(action, **params, backdoor_user_id: user.id)
  end

  # Check if response contains HTMX header
  def has_htmx_trigger?(response, trigger_name : String)
    header = response.headers["HX-Trigger"]?
    return false unless header
    header.includes?(trigger_name)
  end

  # Check for success message header
  def has_success_message?(response)
    response.headers["X-Success-Message"]?.present?
  end
end

# Include in all specs
Spec.after_each do
  # Reset any state if needed
end
