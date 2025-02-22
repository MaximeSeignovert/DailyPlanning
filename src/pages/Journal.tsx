import { DailyStandupView } from '@/components/activities/DailyStandupView';
import { ActivityList } from '@/components/activities/ActivityList';

export function Journal() {
  return (
    <div className="space-y-8">
      <DailyStandupView />
      <ActivityList />
    </div>
  );
}