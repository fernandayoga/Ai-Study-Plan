import WeekSection from "./WeekSection";

export default function RoadmapView({ goal, onUpdate }) {
  // Group tasks by week
  const tasksByWeek = goal.roadmap.reduce((acc, task) => {
    const week = task.week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {});

  const weeks = Object.keys(tasksByWeek).sort((a, b) => Number(a) - Number(b));

  return (
    <div>
      {weeks.map((week) => (
        <WeekSection
          key={week}
          weekNumber={Number(week)}
          tasks={tasksByWeek[week]}
          goalId={goal._id}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}