abstract class ApplicationPolicy(T)
  getter user : User?
  getter record : T

  def initialize(@user : User?, @record : T)
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def delete?
    false
  end
end
