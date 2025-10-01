class SecretSantaAssignmentPolicy < ApplicationPolicy(SecretSantaAssignment)
  def update_status?
    # Only the giver can update their assignment status
    giver?
  end

  private def giver?
    return false unless giver = record.giver
    giver.user_id == user.id
  end
end
