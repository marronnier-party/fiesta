module HTMX
  def htmx?
    request.headers["HX-Request"]? == "true"
  end

  # Alias for consistency
  def htmx_request?
    htmx?
  end
end
