class Tasks::Create < BrowserAction
  post "/tasks" do
    SaveTask.create(params) do |operation, task|
      if task
        flash.success = "The record has been saved"
        redirect Show.with(task.id)
      else
        flash.failure = "It looks like the form is not valid"
        html NewPage, operation: operation
      end
    end
  end
end
