import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Simple Webpage</h1>
        <p className="paragraph-large text-muted-foreground">
          This paragraph uses the paragraph large typography style from your
          design tokens.
        </p>
        <input
          type="text"
          placeholder="First input"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="text"
          placeholder="Second input"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button className="w-full">Submit</Button>
      </div>
    </main>
  );
}

export default App;
