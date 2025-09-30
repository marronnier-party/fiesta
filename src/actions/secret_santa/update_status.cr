class SecretSanta::UpdateStatus < BrowserAction
  post "/secret_santa/assignments/:assignment_id/status" do
    assignment = SecretSantaAssignmentQuery.new
      .preload_giver
      .preload_secret_santa
      .find(assignment_id)

    # Only the giver can update their assignment
    unless assignment.giver!.user_id == current_user.id
      flash.failure = r("errors.unauthorized").t
      redirect to: Events::Show.with(assignment.secret_santa!.event_id)
    end

    status_param = params.get?("status").to_s

    new_status = case status_param
                 when "purchased"
                   SecretSantaAssignment::Status::Purchased
                 when "given"
                   SecretSantaAssignment::Status::Given
                 else
                   SecretSantaAssignment::Status::Pending
                 end

    SaveSecretSantaAssignment.update(assignment, status: new_status) do |operation, updated|
      if updated
        flash.success = "Status updated successfully"
      else
        flash.failure = r("errors.invalid").t
      end
    end

    redirect to: SecretSanta::Show.with(assignment.secret_santa!.event_id)
  end
end
