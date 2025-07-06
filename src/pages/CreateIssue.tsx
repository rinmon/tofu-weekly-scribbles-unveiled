import { Header } from "@/components/Header";
import { WeeklyIssueForm } from "@/components/WeeklyIssueForm";

const CreateIssue = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WeeklyIssueForm />
      </main>
    </div>
  );
};

export default CreateIssue;