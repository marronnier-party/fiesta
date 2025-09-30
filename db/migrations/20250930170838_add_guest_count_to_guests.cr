class AddGuestCountToGuests::V20250930170838 < Avram::Migrator::Migration::V1
  def migrate
    alter table_for(Guest) do
      add guest_count : Int32, default: 1
      add notes : String?
    end
  end

  def rollback
    alter table_for(Guest) do
      remove :guest_count
      remove :notes
    end
  end
end
