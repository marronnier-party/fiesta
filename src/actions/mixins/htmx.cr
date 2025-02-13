module HTMX
  def htmx?
    request.headers["HX-Request"]? == "true"
  end
end
