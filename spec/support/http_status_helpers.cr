module HttpStatusHelpers
  def be_ok
    HTTP::Status::OK
  end

  def be_found
    HTTP::Status::FOUND
  end

  def be_bad_request
    HTTP::Status::BAD_REQUEST
  end

  def be_not_found
    HTTP::Status::NOT_FOUND
  end

  def be_unauthorized
    HTTP::Status::UNAUTHORIZED
  end

  def be_forbidden
    HTTP::Status::FORBIDDEN
  end

  def be_unprocessable_entity
    HTTP::Status::UNPROCESSABLE_ENTITY
  end

  def be_created
    HTTP::Status::CREATED
  end

  def be_no_content
    HTTP::Status::NO_CONTENT
  end
end
