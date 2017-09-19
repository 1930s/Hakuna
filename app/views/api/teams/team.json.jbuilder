json.team do
  json.extract! @team, :id, :name, :lead_id
end

json.members do
  @team.members.each do |member|
    json.set! member.id do
      json.extract! member, :id, :name, :email
    end
  end
end

projects = current_user.projects.where("team_id = #{@team.id}")

json.projects do
  projects.each do |project|
    json.set! project.id do
      json.extract! project, :id, :name, :description, :lead_id
    end
  end
end

json.tasks do
  projects.each do |project|
    project.tasks.each do |task|
      json.set! task.id do
        json.extract! task,
                      :title,
                      :description,
                      :assignee_id,
                      :due_date,
                      :parent_task_id,
                      :project_id
      end
    end
  end
end