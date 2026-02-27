import { Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ComponentShowcase from "@/pages/ComponentShowcase";

function HomePage() {
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
          className="w-full rounded-md border border-stroke-soft px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="text"
          placeholder="Second input"
          className="w-full rounded-md border border-stroke-soft px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button className="w-full">Submit</Button>
        <Link
          to="/components"
          className="block text-center text-sm text-primary underline underline-offset-4 hover:text-primary-dark"
        >
          View Component Showcase
        </Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/components" element={<ComponentShowcase />} />
    </Routes>
  );
}

export default App;
