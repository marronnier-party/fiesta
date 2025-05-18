class Events::New < BrowserAction
  get "/events/new" do
    redirect to: Events::Wizard::New
  end
end
