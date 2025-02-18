import { Editor } from '@/components/activities/Editor';
import { ActivityList } from '@/components/activities/ActivityList';

export function Journal() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Journal</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Editor />
        <ActivityList />
      </div>
    </div>
  );
}